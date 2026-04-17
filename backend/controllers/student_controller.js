const bcrypt = require("bcrypt");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");
const XLSX = require("xlsx");
const Sclass = require("../models/sclassSchema.js");
const fs = require("fs");



const bulkUploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📂 Uploaded file:", req.file.path);

    // Read Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    console.log("📊 Rows parsed:", rows.length);

    let createdStudents = [];
    let skipped = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Normalize keys
      const Name = row["Name"]?.trim();
      const Class = row["Class"]?.trim();
      const RollNumber = row["Roll Number"] ?? row["RollNumber"];
      const Password = row["Password"]?.toString().trim();

      if (!Name || !Class || !RollNumber || !Password) {
        skipped.push({ row, reason: "Missing required fields" });
        continue;
      }

      // Find class
      const sclass = await Sclass.findOne({ sclassName: Class });
      if (!sclass) {
        skipped.push({ row, reason: `Class '${Class}' not found` });
        continue;
      }

      // Check duplicate
      const existingStudent = await Student.findOne({
        rollNum: RollNumber,
        sclassName: sclass._id,
        school: req.body.adminID,
      });

      if (existingStudent) {
        skipped.push({ row, reason: "Roll Number already exists" });
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(Password, salt);

      const student = new Student({
        name: Name,
        rollNum: RollNumber,
        password: hashedPass,
        sclassName: sclass._id,
        school: req.body.adminID,
        role: "Student",
        attendance: [],
      });

      await student.save();
      student.password = undefined;

      createdStudents.push(student);
    }

    // Cleanup
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: "✅ Bulk student upload completed",
      created: createdStudents.length,
      skipped,
      students: createdStudents,
    });

  } catch (err) {
    console.error("❌ Bulk Upload Error:", err);
    if (req.file?.path) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Error processing Excel file", error: err.message });
  }
};
const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained, suggestion } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: "Student not found" });
        }

        const existingResult = student.examResult.find(
            (r) => r.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;

            if (suggestion) {
                existingResult.suggestion = {
                    performance: suggestion.performance || "",
                    advice: suggestion.advice || "",
                    attendanceMsg: suggestion.attendanceMsg || ""
                };
            }
        } else {
            student.examResult.push({
                subName,
                marksObtained,
                suggestion: {
                    performance: suggestion?.performance || "",
                    advice: suggestion?.advice || "",
                    attendanceMsg: suggestion?.attendanceMsg || ""
                }
            });
        }
        // ✅ ADD NOTIFICATION
        student.notifications.push({
        message: `New marks added for subject. Score: ${marksObtained}`,
    });

        const result = await student.save();
        res.send(result);

    } catch (error) {
        res.status(500).json(error);
    }
};
const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
    bulkUploadStudents,
};
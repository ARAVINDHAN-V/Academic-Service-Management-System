const express = require("express");
const multer = require("multer");
const router = express.Router();
const axios = require("axios");

// ✅ CHECK ENV
if (!process.env.OPENROUTER_API_KEY) {
    console.log("❌ OPENROUTER API KEY MISSING");
} else {
    console.log("✅ OPENROUTER API KEY LOADED");
}

const Student = require("../models/studentSchema");
// Controllers
const { adminRegister, adminLogIn, getAdminDetail } = require('../controllers/admin-controller');

const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller');

const { 
    complainCreate, 
    complainList, 
    updateComplainStatus 
} = require('../controllers/complain-controller');

const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller');

const {
    studentRegister, studentLogIn, getStudents, getStudentDetail, deleteStudents,
    deleteStudent, updateStudent, studentAttendance, deleteStudentsByClass, updateExamResult,
    clearAllStudentsAttendanceBySubject, clearAllStudentsAttendance,
    removeStudentAttendanceBySubject, removeStudentAttendance
} = require('../controllers/student_controller');

const {
    subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail,
    deleteSubject, freeSubjectList, allSubjects, deleteSubjects
} = require('../controllers/subject-controller');

const {
    teacherRegister, teacherLogIn, getTeachers, getTeacherDetail,
    deleteTeachers, deleteTeachersByClass, deleteTeacher,
    updateTeacherSubject, teacherAttendance
} = require('../controllers/teacher-controller');

const upload = multer({ dest: "uploads/" });

/* =========================
   🔐 ADMIN
========================= */
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);
router.get("/Admin/:id", getAdminDetail);

/* =========================
   🎓 STUDENTS
========================= */
router.post('/StudentReg', studentRegister);
router.post('/StudentLogin', studentLogIn);

router.get("/Students/:id", getStudents);
router.get("/Student/:id", getStudentDetail);

router.delete("/Students/:id", deleteStudents);
router.delete("/StudentsClass/:id", deleteStudentsByClass);
router.delete("/Student/:id", deleteStudent);

router.put("/Student/:id", updateStudent);
router.put('/UpdateExamResult/:id', updateExamResult);
router.put('/StudentAttendance/:id', studentAttendance);

router.put('/RemoveAllStudentsSubAtten/:id', clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);

router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance);

/* =========================
   👨‍🏫 TEACHERS
========================= */
router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn);

router.get("/Teachers/:id", getTeachers);
router.get("/Teacher/:id", getTeacherDetail);

router.delete("/Teachers/:id", deleteTeachers);
router.delete("/TeachersClass/:id", deleteTeachersByClass);
router.delete("/Teacher/:id", deleteTeacher);

router.put("/TeacherSubject", updateTeacherSubject);
router.post('/TeacherAttendance/:id', teacherAttendance);

/* =========================
   🏫 CLASSES
========================= */
router.post('/SclassCreate', sclassCreate);
router.get('/SclassList/:id', sclassList);
router.get("/Sclass/:id", getSclassDetail);
router.get("/Sclass/Students/:id", getSclassStudents);

router.delete("/Sclasses/:id", deleteSclasses);
router.delete("/Sclass/:id", deleteSclass);

/* =========================
   📚 SUBJECTS
========================= */
router.post('/SubjectCreate', subjectCreate);

router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get("/Subject/:id", getSubjectDetail);

router.delete("/Subject/:id", deleteSubject);
router.delete("/Subjects/:id", deleteSubjects);
router.delete("/SubjectsClass/:id", deleteSubjectsByClass);

/* =========================
   📢 NOTICE
========================= */
router.post('/NoticeCreate', noticeCreate);
router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices);
router.delete("/Notice/:id", deleteNotice);

router.put("/Notice/:id", updateNotice);

/* =========================
   ⚠️ COMPLAINS
========================= */
router.post('/ComplainCreate', complainCreate);
router.get('/ComplainList/:id', complainList);
router.put("/Complain/:id", updateComplainStatus);
// =========================
// 🤖 AI CHATBOT
// =========================
router.post("/api/ai/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo", // FREE model
                messages: [{ role: "user", content: message }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            reply: response.data.choices[0].message.content
        });

    } catch (error) {
        console.log("❌ AI ERROR:", error.response?.data || error.message);
        res.status(500).json({ reply: "AI not working" });
    }
});

// =========================
// 📝 AI NOTICE
// =========================
router.post("/generate-notice", async (req, res) => {
    const { topic } = req.body;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Write a formal school notice about ${topic}`
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            notice: response.data.choices[0].message.content
        });

    } catch (error) {
        console.log("❌ NOTICE ERROR:", error.response?.data || error.message);
        res.status(500).json({ notice: "AI failed" });
    }
});

/* =========================
   ⚠️ ATTENDANCE RISK
========================= */
router.get("/attendance-risk", async (req, res) => {
    const students = await Student.find();

    const risky = students.filter(s => s.attendance < 75);

    res.json(risky.map(s => ({
        name: s.name,
        message: `Low attendance (${s.attendance}%)`
    })));
});


// =========================
// 🤖 REAL AI GRADE SUGGESTION
// =========================
router.post("/grade", async (req, res) => {
    const { marks, attendance, subject } = req.body;

    try {
        const prompt = `
Return ONLY JSON (no extra text):

{
  "performance": "",
  "advice": "",
  "attendanceMsg": ""
}

Student Details:
- Marks: ${marks}
- Attendance: ${attendance}%
- Subject: ${subject}

Rules:
- performance = Excellent / Good / Average / Poor
- advice = short improvement tip
- attendanceMsg = short message about attendance
`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const aiText = response.data.choices[0].message.content;

        let parsed;

        try {
            parsed = JSON.parse(aiText);
        } catch (err) {
            parsed = {
                performance: "Unknown",
                advice: aiText,
                attendanceMsg: ""
            };
        }

        res.json({ suggestion: parsed });

    } catch (error) {
        console.log("❌ AI ERROR:", error.response?.data || error.message);
        res.status(500).json({ suggestion: null });
    }
});

// =========================
// 🔔 GET NOTIFICATIONS
// =========================
router.get("/notifications/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("examResult.subName", "subName");

        if (!student) {
            return res.json([]);
        }

        let notifications = [];

        // ✅ AI Suggestions notifications
        student.examResult.forEach((exam) => {
            if (exam.suggestion && exam.suggestion.advice) {
                notifications.push({
                    type: "AI",
                    message: `${exam.subName.subName}: ${exam.suggestion.advice}`
                });
            }
        });

        // ✅ Attendance warning
        const total = student.attendance.length;
        const present = student.attendance.filter(a => a.status === "Present").length;
        const percent = total ? (present / total) * 100 : 100;

        if (percent < 75) {
            notifications.push({
                type: "Attendance",
                message: `Low attendance (${percent.toFixed(1)}%)`
            });
        }

        res.json(notifications);

    } catch (err) {
        res.status(500).json(err);
    }
});
router.get("/teacher-notifications", async (req, res) => {
    try {
        const students = await Student.find().populate("sclassName", "sclassName");

        let notifications = [];

        students.forEach(student => {
            const total = student.attendance.length;
            const present = student.attendance.filter(a => a.status === "Present").length;
            const percent = total ? (present / total) * 100 : 100;

            if (percent < 75) {
                notifications.push({
                    message: `${student.name} (${student.sclassName.sclassName}) - Low attendance (${percent.toFixed(1)}%)`
                });
            }
        });

        res.json(notifications);

    } catch (err) {
        res.status(500).json(err);
    }
});
router.get("/admin-notifications", async (req, res) => {
    try {
        const students = await Student.find().populate("sclassName", "sclassName");

        let notifications = [];

        students.forEach(student => {

            // Attendance alert
            const total = student.attendance.length;
            const present = student.attendance.filter(a => a.status === "Present").length;
            const percent = total ? (present / total) * 100 : 100;

            if (percent < 75) {
                notifications.push({
                    message: `${student.name} has low attendance (${percent.toFixed(1)}%)`
                });
            }

            // AI suggestion alert
            student.examResult.forEach(exam => {
                if (exam.suggestion && exam.suggestion.advice) {
                    notifications.push({
                        message: `${student.name} - ${exam.suggestion.advice}`
                    });
                }
            });

        });

        res.json(notifications);

    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;
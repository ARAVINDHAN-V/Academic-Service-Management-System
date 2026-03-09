// import * as React from "react";
// import {
//   Divider,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   ListSubheader,
//   List,
//   Tooltip,
// } from "@mui/material";
// import { Link, useLocation } from "react-router-dom";

// import HomeIcon from "@mui/icons-material/Home";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
// import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
// import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
// import ReportIcon from "@mui/icons-material/Report";
// import AssignmentIcon from "@mui/icons-material/Assignment";

// const menuItems = [
//   { label: "Home", icon: <HomeIcon />, path: "/" },
//   { label: "Classes", icon: <ClassOutlinedIcon />, path: "/Admin/classes" },
//   { label: "Subjects", icon: <AssignmentIcon />, path: "/Admin/subjects" },
//   { label: "Teachers", icon: <SupervisorAccountOutlinedIcon />, path: "/Admin/teachers" },
//   { label: "Students", icon: <PersonOutlineIcon />, path: "/Admin/students" },
//   { label: "Notices", icon: <AnnouncementOutlinedIcon />, path: "/Admin/notices" },
//   { label: "Complains", icon: <ReportIcon />, path: "/Admin/complains" },
// ];

// const userItems = [
//   { label: "Profile", icon: <AccountCircleOutlinedIcon />, path: "/Admin/profile" },
//   { label: "Logout", icon: <ExitToAppIcon />, path: "/logout" },
// ];

// const SideBar = ({ collapsed }) => {
//   const location = useLocation();

//   const renderMenuItem = (item) => {
//     const isActive = location.pathname.startsWith(item.path);

//     const button = (
//       <ListItemButton
//         key={item.label}
//         component={Link}
//         to={item.path}
//         sx={{
//           mb: 0.5,
//           borderRadius: "12px",
//           mx: 1,
//           justifyContent: collapsed ? "center" : "flex-start",
//           backgroundColor: isActive ? "rgba(127, 86, 218, 0.15)" : "transparent",
//           "&:hover": {
//             backgroundColor: "rgba(127, 86, 218, 0.1)",
//           },
//         }}
//       >
//         <ListItemIcon
//           sx={{
//             color: isActive ? "#7f56da" : "inherit",
//             minWidth: collapsed ? "auto" : 40,
//             justifyContent: "flex-start",
//             pl: collapsed ? 0 : -10,
//           }}
//         >
//           {item.icon}
//         </ListItemIcon>
//         {!collapsed && (
//           <ListItemText
//             primary={item.label}
//             primaryTypographyProps={{
//               fontWeight: isActive ? "bold" : "normal",
//               color: isActive ? "#7f56da" : "inherit",
//             }}
//           />
//         )}
//       </ListItemButton>
//     );

//     return collapsed ? (
//       <Tooltip title={item.label} placement="right" arrow key={item.label}>
//         {button}
//       </Tooltip>
//     ) : (
//       button
//     );
//   };

//   return (
//     <List
//       sx={{
//         height: "100vh",
//         background: "linear-gradient(180deg, #f5f5fa, #ffffff)",
//         p: 1,
//         width: collapsed ? "70px" : "220px",
//         transition: "all 0.3s ease",
//       }}
//     >
//       {/* Top Menu */}
//       {menuItems.map(renderMenuItem)}

//       <Divider sx={{ my: 2 }} />

//       {/* User Section */}
//       {!collapsed && (
//         <ListSubheader
//           component="div"
//           sx={{
//             fontWeight: "bold",
//             color: "#6a11cb",
//             pl: 2,
//             fontSize: "0.9rem",
//           }}
//         >
//           User
//         </ListSubheader>
//       )}
//       {userItems.map(renderMenuItem)}
//     </List>
//   );
// };

// export default SideBar;



import * as React from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  List,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ReportIcon from "@mui/icons-material/Report";
import AssignmentIcon from "@mui/icons-material/Assignment";

const menuItems = [
  { label: "Home", icon: <HomeIcon />, path: "/" },
  { label: "Classes", icon: <ClassOutlinedIcon />, path: "/Admin/classes" },
  { label: "Subjects", icon: <AssignmentIcon />, path: "/Admin/subjects" },
  { label: "Teachers", icon: <SupervisorAccountOutlinedIcon />, path: "/Admin/teachers" },
  { label: "Students", icon: <PersonOutlineIcon />, path: "/Admin/students" },
  { label: "Notices", icon: <AnnouncementOutlinedIcon />, path: "/Admin/notices" },
  { label: "Complains", icon: <ReportIcon />, path: "/Admin/complains" },
];

const userItems = [
  { label: "Profile", icon: <AccountCircleOutlinedIcon />, path: "/Admin/profile" },
  { label: "Logout", icon: <ExitToAppIcon />, path: "/logout" },
];

const SideBar = ({ collapsed }) => {
  const location = useLocation();

  const renderMenuItem = (item) => {
    const isActive = location.pathname.startsWith(item.path);

    const button = (
      <ListItemButton
        key={item.label}
        component={Link}
        to={item.path}
        sx={{
          mb: 0.8,
          borderRadius: "12px",
          mx: 1,
          justifyContent: collapsed ? "center" : "flex-start",
          background: isActive
            ? "linear-gradient(90deg, #7f56da, #9d7ae5)"
            : "transparent",
          color: isActive ? "#fff" : "#555",
          boxShadow: isActive ? "0 2px 6px rgba(127,86,218,0.3)" : "none",
          transition: "all 0.3s ease",
          "&:hover": {
            background: isActive
              ? "linear-gradient(90deg, #7f56da, #9d7ae5)"
              : "rgba(127, 86, 218, 0.08)",
            color: isActive ? "#fff" : "#7f56da",
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? "#fff" : "#7f56da",
            minWidth: collapsed ? "auto" : 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: isActive ? "bold" : "medium",
              color: isActive ? "#fff" : "inherit",
            }}
          />
        )}
      </ListItemButton>
    );

    // Always show tooltip on hover
    return (
      <Tooltip title={item.label} placement="right" arrow key={item.label}>
        {button}
      </Tooltip>
    );
  };

  return (
    <List
      sx={{
        height: "100vh",
        background: "#d9f8cdff",
        p: 1,
        width: collapsed ? "70px" : "230px",
        transition: "all 0.3s ease",
        borderRight: "3px solid #f7f4f4ff",
        boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* Top Menu */}
      {menuItems.map((item) => {
  const isActive = location.pathname.startsWith(item.path);

  const button = (
    <ListItemButton
      component={Link}
      to={item.path}
      sx={{
        mb: 0.8,
        borderRadius: "12px",
        mx: 1,
        justifyContent: collapsed ? "center" : "flex-start",
        background: isActive ? "#7f56da" : "transparent",
        color: isActive ? "#fff" : "#555",
        transition: "all 0.3s ease",
        "&:hover": {
          background: isActive ? "#7f56da" : "rgba(127, 86, 218, 0.08)",
          color: isActive ? "#fff" : "#7f56da",
        },
      }}
    >
      <ListItemIcon
        sx={{
          color: isActive ? "#fff" : "#7f56da",
          minWidth: 0,
          mr: collapsed ? 0 : 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {item.icon}
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontWeight: isActive ? "bold" : "medium",
            fontSize: "0.95rem",
          }}
        />
      )}
    </ListItemButton>
  );

  // ✅ Only show tooltip when collapsed
  return collapsed ? (
    <Tooltip title={item.label} placement="right" arrow key={item.label}>
      {button}
    </Tooltip>
  ) : (
    <React.Fragment key={item.label}>{button}</React.Fragment>
  );
})}


      <Divider sx={{ my: 2 }} />

      {/* User Section */}
      {!collapsed && (
        <ListSubheader
          component="div"
          sx={{
            fontWeight: "bold",
            color: "#7f56da",
            pl: 2,
            fontSize: "0.85rem",
            opacity: 0.8,
            backgroundColor:"#d9f8cdff"
          }}
        >
          User
        </ListSubheader>
      )}

      {userItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);

        return (
          <Tooltip title={item.label} placement="right" arrow key={item.label}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                mb: 0.8,
                borderRadius: "12px",
                mx: 1,
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive ? "#7f56da" : "transparent",
                color: isActive ? "#fff" : "#555",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: isActive
                    ? "#7f56da"
                    : "rgba(127, 86, 218, 0.08)",
                  color: isActive ? "#fff" : "#7f56da",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "#fff" : "#7f56da",
                  minWidth: collapsed ? "auto" : 40,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "medium",
                    fontSize: "0.9rem",
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>

  );
};

export default SideBar;













// import * as React from 'react';
// import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
// import { Link, useLocation } from 'react-router-dom';

// import HomeIcon from "@mui/icons-material/Home";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
// import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
// import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
// import ReportIcon from '@mui/icons-material/Report';
// import AssignmentIcon from '@mui/icons-material/Assignment';

// const SideBar = () => {
//     const location = useLocation();
//     return (
//         <>
//             <React.Fragment>
//                 <ListItemButton component={Link} to="/">
//                     <ListItemIcon>
//                         <HomeIcon color={location.pathname === ("/" || "/Admin/dashboard") ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Home" />
//                 </ListItemButton>
//                 <ListItemButton component={Link} to="/Admin/classes">
//                     <ListItemIcon>
//                         <ClassOutlinedIcon color={location.pathname.startsWith('/Admin/classes') ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Classes" />
//                 </ListItemButton>
//                 <ListItemButton component={Link} to="/Admin/subjects">
//                     <ListItemIcon>
//                         <AssignmentIcon color={location.pathname.startsWith("/Admin/subjects") ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Subjects" />
//                 </ListItemButton>
//                 <ListItemButton component={Link} to="/Admin/teachers">
//                     <ListItemIcon>
//                         <SupervisorAccountOutlinedIcon color={location.pathname.startsWith("/Admin/teachers") ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Teachers" />
//                 </ListItemButton>
//                 <ListItemButton component={Link} to="/Admin/students">
//                     <ListItemIcon>
//                         <PersonOutlineIcon color={location.pathname.startsWith("/Admin/students") ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Students" />
//                 </ListItemButton>
//                 <ListItemButton component={Link} to="/Admin/notices">
//                     <ListItemIcon>
//                         <AnnouncementOutlinedIcon color={location.pathname.startsWith("/Admin/notices") ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Notices" />
//                 </ListItemButton>
//                 <ListItemButton component={Link} to="/Admin/complains">
//                     <ListItemIcon>
//                         <ReportIcon color={location.pathname.startsWith("/Admin/complains") ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Complains" />
//                 </ListItemButton>
//             </React.Fragment>
//             <Divider sx={{ my: 1 }} />
//             <React.Fragment>
//                 <ListSubheader component="div" inset>
//                     User
//                 </ListSubheader>
//                 <ListItemButton component={Link} to="/Admin/profile">
//                     <ListItemIcon>
//                         <AccountCircleOutlinedIcon color={location.pathname.startsWith("/Admin/profile") ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Profile" />
//                 </ListItemButton>
//                 <ListItemButton component={Link} to="/logout">
//                     <ListItemIcon>
//                         <ExitToAppIcon color={location.pathname.startsWith("/logout") ? 'primary' : 'inherit'} />
//                     </ListItemIcon>
//                     <ListItemText primary="Logout" />
//                 </ListItemButton>
//             </React.Fragment>
//         </>
//     )
// }

// export default SideBar




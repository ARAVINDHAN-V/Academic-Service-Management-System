
import {
    TableCell,TableRow,styled,tableCellClasses,Drawer as MuiDrawer,AppBar as MuiAppBar} from "@mui/material";
import { createTheme } from "@mui/material/styles";

const drawerWidth = 260;

// ─── Global MUI Theme ───────────────────────────────────────────────────────
export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#4f46e5",
            light: "#6366f1",
            dark: "#3730a3",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#06b6d4",
            light: "#22d3ee",
            dark: "#0891b2",
            contrastText: "#ffffff",
        },
        success: { main: "#10b981" },
        warning: { main: "#f59e0b" },
        error:   { main: "#ef4444" },
        background: {
            default: "#f8fafc",
            paper: "#ffffff",
        },
        text: {
            primary: "#0f172a",
            secondary: "#475569",
            disabled: "#94a3b8",
        },
        divider: "#e2e8f0",
    },
    typography: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        h1: { fontWeight: 800, fontSize: "2.5rem" },
        h2: { fontWeight: 700, fontSize: "2rem" },
        h3: { fontWeight: 700, fontSize: "1.5rem" },
        h4: { fontWeight: 700, fontSize: "1.25rem" },
        h5: { fontWeight: 600, fontSize: "1.1rem" },
        h6: { fontWeight: 600, fontSize: "1rem" },
        body1: { fontSize: "0.9375rem", lineHeight: 1.65 },
        body2: { fontSize: "0.875rem", lineHeight: 1.6 },
        button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.01em" },
        subtitle1: { fontWeight: 500, color: "#475569" },
        subtitle2: { fontWeight: 500, color: "#64748b", fontSize: "0.8125rem" },
    },
    shape: { borderRadius: 10 },
    shadows: [
        "none",
        "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
        "0 2px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)",
        "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        "0 6px 20px rgba(0,0,0,0.09)",
        "0 8px 28px rgba(0,0,0,0.1)",
        "0 10px 36px rgba(0,0,0,0.1)",
        "0 12px 44px rgba(0,0,0,0.11)",
        "0 16px 52px rgba(0,0,0,0.12)",
        ...Array(16).fill("0 20px 60px rgba(0,0,0,0.13)"),
    ],
    components: {
        MuiCssBaseline: {
    styleOverrides: {
        body: {
            backgroundColor: "#f8fafc",
        },
    },
},
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: "10px 22px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                },
                contained: {
                    background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
                    },
                    "&:active": { transform: "translateY(0)" },
                    transition: "all 0.2s ease",
                },
                outlined: {
                    borderWidth: "1.5px",
                    "&:hover": { borderWidth: "1.5px" },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 10,
                        backgroundColor: "#f8fafc",
                        transition: "box-shadow 0.2s ease",
                        "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
                        "&:hover fieldset": { borderColor: "#a5b4fc" },
                        "&.Mui-focused fieldset": {
                            borderColor: "#4f46e5",
                            boxShadow: "0 0 0 3px rgba(79,70,229,0.12)",
                        },
                        "&.Mui-focused": { backgroundColor: "#fff" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#4f46e5" },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    borderRadius: 16,
                },
                elevation1: { boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)" },
                elevation3: { boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)" },
                elevation6: { boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)" },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                    "&:hover": {
                        boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
                        transform: "translateY(-2px)",
                    },
                    transition: "box-shadow 0.25s ease, transform 0.25s ease",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    margin: "2px 8px",
                    padding: "10px 14px",
                    "&.Mui-selected": {
                        backgroundColor: "#eef2ff",
                        color: "#4f46e5",
                        "& .MuiListItemIcon-root": { color: "#4f46e5" },
                        "&:hover": { backgroundColor: "#e0e7ff" },
                    },
                    "&:hover": { backgroundColor: "#f1f5f9" },
                    transition: "background 0.15s ease",
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: { minWidth: 40, color: "#64748b" },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    "& .MuiTableCell-head": {
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        fontWeight: 700,
                        fontSize: "0.8125rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "2px solid #e2e8f0",
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "0.9rem",
                    padding: "14px 16px",
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:hover": { backgroundColor: "#f8fafc" },
                    transition: "background 0.15s ease",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderBottom: "1px solid #e2e8f0",
                    boxShadow: "none",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#ffffff",
                    borderRight: "1px solid #e2e8f0",
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: "#e2e8f0" },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: "#0f172a",
                    fontSize: "0.78rem",
                    borderRadius: 8,
                    padding: "6px 12px",
                },
                arrow: { color: "#0f172a" },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: 12 },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "#cbd5e1",
                    "&.Mui-checked": { color: "#4f46e5" },
                },
            },
        },
    },
});

// ─── Styled Table Components ─────────────────────────────────────────────────
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#f1f5f9",
        color: "#475569",
        fontWeight: 700,
        fontSize: "0.8rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "2px solid #e2e8f0",
        padding: "14px 16px",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: "0.9rem",
        color: "#0f172a",
        borderBottom: "1px solid #f1f5f9",
        padding: "14px 16px",
    },
}));

export const StyledTableRow = styled(TableRow)(() => ({
    "&:nth-of-type(odd)": {
        backgroundColor: "#fafbff",
    },
    "&:hover": {
        backgroundColor: "#f0f4ff !important",
        transition: "background 0.15s ease",
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

// ─── AppBar ───────────────────────────────────────────────────────────────────
export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#ffffff",
    color: "#0f172a",
    boxShadow: "none",
    borderBottom: "1px solid #e2e8f0",
    backgroundImage: "none",
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// ─── Drawer ───────────────────────────────────────────────────────────────────
export const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        overflowX: "hidden",
        ...(!open && {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

export { drawerWidth };
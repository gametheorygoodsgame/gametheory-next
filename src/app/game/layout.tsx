import StudentMenuBar from "./StudentMenuBar";

export default function StudentLayout({ children }) {
    return (
        <>
            <StudentMenuBar />
            <main>{children}</main>
        </>
    );
}
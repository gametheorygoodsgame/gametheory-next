import StudentMenuBar from './StudentMenuBar';

export default function StudentLayout({ children }:{ children: any }) {
    return (
        <>
            <StudentMenuBar />
            <main>{children}</main>
        </>
    );
}

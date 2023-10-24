import StudentLogin from "../page";

export default function LinkGameID({ params }) {
    const gameID = params.gameID;
    return (
        <StudentLogin gameIdIn={gameID} />
    );
}
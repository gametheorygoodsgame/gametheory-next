import StudentLogin from '../page';

// @ts-ignore
export default function LinkGameID({ params }) {
    const { gameID } = params;

    return (
        <StudentLogin gameIdIn={gameID} />
    );
}

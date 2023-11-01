import PlayerMenuBar from '../../components/menuBars/PlayerMenuBar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PlayerMenuBar />
      <main>{children}</main>
    </>
  );
}

import KanbanProjectApp from "@/components/home"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center justify-between w-full max-w-5xl mb-8">
        <KanbanProjectApp />
      </div>
    </main>
  )
}

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/widgets/cricket/scoreboard");
}

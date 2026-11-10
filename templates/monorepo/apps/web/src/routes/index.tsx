import { createFileRoute } from "@tanstack/react-router";
import { greet } from "@repo/utils";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<main>
			<h1>{greet("world")}</h1>
		</main>
	);
}

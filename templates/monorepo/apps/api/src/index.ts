import { createServer } from "node:http";
import { greet } from "@repo/utils";

const port = Number(process.env["PORT"] ?? 3001);

createServer((_request, response) => {
	response.writeHead(200, { "content-type": "application/json" });
	response.end(JSON.stringify({ message: greet("world") }));
}).listen(port, () => {
	console.log(`API listening on http://localhost:${String(port)}`);
});

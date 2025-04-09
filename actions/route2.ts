"use server";

export async function StreamResponse() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        controller.enqueue(encoder.encode(`Update ${i + 1}\n`));
      }
      controller.close();
    },
  });

  return stream; // ✅ Return the stream directly, not a Response object
}

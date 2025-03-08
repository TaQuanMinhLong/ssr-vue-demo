import { renderHTMLStream } from "./dist/server/entry-server.js";
import { Transform } from "stream";
import fs from "fs";

const template = {
  name: "HelloWorld2",
  props: {
    data: "Hello World",
  },
};

const templateStream = fs.createReadStream("./dist/client/index.html");
const ssrStream = renderHTMLStream(template);
const writer = fs.createWriteStream("./ssr2.html");

// Create a transform stream to inject the SSR data script
const injectSSRData = new Transform({
  transform(chunk, encoding, callback) {
    let chunkStr = chunk.toString();

    // Find the closing head tag to inject our script
    const headCloseIndex = chunkStr.indexOf("</head>");

    if (headCloseIndex !== -1) {
      // Inject the SSR data script before the closing head tag
      const ssrDataScript = `<script>window.__SSR_DATA__ = ${JSON.stringify(template)};</script>`;

      const beforeHead = chunkStr.substring(0, headCloseIndex);
      const afterHead = chunkStr.substring(headCloseIndex);

      chunkStr = beforeHead + ssrDataScript + afterHead;
    }

    this.push(chunkStr);
    callback();
  },
});

const APP_MARKER = "<!--app-->";

// Buffer to store any content after the marker in the current chunk
let contentAfterMarker = null;

// Create a transform stream to detect the SSR marker
const markerDetector = new Transform({
  transform(chunk, encoding, callback) {
    const chunkStr = chunk.toString();
    const markerIndex = chunkStr.indexOf(APP_MARKER);

    if (markerIndex !== -1) {
      // Split the chunk at the marker
      const beforeMarker = chunkStr.substring(0, markerIndex);
      this.push(beforeMarker);

      // Store any content after the marker for later use
      contentAfterMarker = chunkStr.substring(markerIndex + APP_MARKER.length);

      // Pause the template stream
      templateStream.pause();

      // Signal that we found the marker
      this.emit("markerFound");
    } else {
      // If no marker found, push the whole chunk
      this.push(chunk);
    }

    callback();
  },
});

// Set up the pipeline
templateStream.pipe(injectSSRData).pipe(markerDetector).pipe(writer, { end: false });

// When marker is found, switch to SSR stream
markerDetector.on("markerFound", () => {
  // Pipe SSR content
  ssrStream.pipe(writer, { end: false });

  ssrStream.on("end", () => {
    // If we had content after the marker in the same chunk, write it first
    if (contentAfterMarker && contentAfterMarker.length > 0) {
      writer.write(contentAfterMarker);
    }

    // Resume the template stream and pipe directly to the writer
    templateStream.resume();
    templateStream.pipe(writer);
  });
});

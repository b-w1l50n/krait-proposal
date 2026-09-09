# KRAIT proposal

Client presentation, interactive hardware concepts, and selected study results.

View the presentation at https://krait-proposal.erinyes-tech.com/.

## Run a local copy

1. Open this repository.
2. Select **Code → Download ZIP**, then extract the archive.
3. Open a terminal in the extracted folder containing `index.html`.
4. With Python installed, run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

5. Open **http://127.0.0.1:8000** in a browser. Stop the server with Ctrl+C.

Opening index.html directly as a file will not reliably load the JavaScript modules. The presentation uses local dependencies and does not require Internet access after download.

Use the navigation to review Hardware, Coordination, Waveform, Electronics, Development, Contractor Proposal, and For Review. Hardware can be rotated and zoomed; labels can be toggled. The signal study includes Send TX, a distance slider, delayed reception, and an FFT of a synthetic 32 kHz burst plus noise. These interactive signals are illustrative, not measured study results.

Custom-transducer quotes are being requested; selection and pricing remain pending. Both modem BOM figures are preliminary targets. The engineering offer covers PCB design, bench validation and basic code for $15,000, with exact scope and acceptance criteria to be agreed.

This repository contains presentation files only, not the private engineering implementation, source BOMs or complete handoff package. The presentation and this repository are public. GitHub Pages publishes the main branch; CNAME specifies the custom domain. Search-engine exclusion requests are advisory, not access controls.

Three.js and OrbitControls retain their MIT license in THREE-LICENSE.txt. That dependency notice is not a blanket license grant for the proposal content.

import { IpodDetector } from "./ipod-detector";

const dest = process.argv[2];

if(!dest) {
  console.log('Destination required');
  process.exit(1);
}

async function main() {
  const ipods = await IpodDetector.find();

  if(ipods.length === 0) {
    console.log('No iPods found!');
    return;
  }

  for(let i = 0; i < ipods.length; i += 1) {
    const ipod = ipods[i];
    await ipod.copyToFs(dest);
  }
}

main();




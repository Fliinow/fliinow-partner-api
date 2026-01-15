const { FliinowClient, FliinowError } = require('../dist/index.js');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const doList = args.has('--list');
const doCreate = args.has('--create') || !doList;

const apiKey = process.env.FLIINOW_API_KEY;
const sandbox = (process.env.FLIINOW_SANDBOX ?? 'true') !== 'false';
const baseUrl = process.env.FLIINOW_BASE_URL;

if (!apiKey && !dryRun) {
  console.error('Missing FLIINOW_API_KEY. Set it to your fk_test_* or fk_live_* key.');
  console.error('Example: FLIINOW_API_KEY=fk_test_xxx node examples/simple-app.js --create');
  process.exit(1);
}

const client = new FliinowClient({
  apiKey: apiKey || 'fk_test_placeholder',
  sandbox,
  baseUrl: baseUrl || undefined,
});

async function run() {
  if (dryRun) {
    console.log('SDK init OK (dry-run).');
    return;
  }

  if (doList) {
    const { content, totalElements } = await client.operations.list({
      page: 0,
      size: 5,
    });

    console.log(`Found ${totalElements} operations (showing ${content.length})`);
    for (const op of content) {
      console.log(`- ${op.id} ${op.status} ${op.externalId}`);
    }
  }

  if (doCreate) {
    const operation = await client.operations.create({
      externalId: `DEMO-${Date.now()}`,
      client: {
        firstName: 'Juan',
        lastName: 'Garcia Lopez',
        email: 'juan@example.com',
        prefix: '+34',
        phone: '612345678',
        documentId: '12345678A',
        documentValidityDate: '31-12-2030',
        gender: 'MALE',
        birthDate: '15-03-1985',
        nationality: 'ESP',
        address: 'Calle Mayor 1',
        city: 'Madrid',
        postalCode: '28001',
        countryCode: 'ES',
      },
      packageName: 'Demo trip to Paris',
      packageTravel: true,
      travelersNumber: 2,
      flightDtoList: [],
      hotelDtoList: [],
      totalPrice: 1500,
      totalReserve: 1500,
    });

    console.log('Operation created:');
    console.log(`id: ${operation.id}`);
    console.log(`status: ${operation.status}`);
    console.log(`financingUrl: ${operation.financingUrl}`);
  }
}

run().catch((error) => {
  if (error instanceof FliinowError) {
    console.error(`FliinowError ${error.code} (${error.statusCode})`);
    console.error(error.message);
    if (error.requestId) {
      console.error(`requestId: ${error.requestId}`);
    }
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

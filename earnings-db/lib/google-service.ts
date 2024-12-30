import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/documents'
  ],
});

const drive = google.drive({ version: 'v3', auth });
const sheets = google.sheets({ version: 'v4', auth });
const docs = google.docs({ version: 'v1', auth });

export async function createTrackingDocs(userEmail: string) {
  try {
    // Copy template sheet
    const sheetsCopy = await drive.files.copy({
      fileId: process.env.GOOGLE_SHEETS_TEMPLATE_ID!,
      requestBody: {
        name: `Earnings Tracking - ${userEmail}`,
      },
    });

    // Copy template doc
    const docsCopy = await drive.files.copy({
      fileId: process.env.GOOGLE_DOCS_TEMPLATE_ID!,
      requestBody: {
        name: `Earnings Analysis - ${userEmail}`,
      },
    });

    // Share with user
    await Promise.all([
      drive.permissions.create({
        fileId: sheetsCopy.data.id!,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: userEmail,
        },
      }),
      drive.permissions.create({
        fileId: docsCopy.data.id!,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: userEmail,
        },
      }),
    ]);

    return {
      sheetsUrl: `https://docs.google.com/spreadsheets/d/${sheetsCopy.data.id}`,
      docsUrl: `https://docs.google.com/document/d/${docsCopy.data.id}`,
    };
  } catch (error) {
    console.error('Error creating tracking docs:', error);
    throw error;
  }
}
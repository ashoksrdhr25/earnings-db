import { connectToDatabase } from '@/lib/mongodb';
import { createTrackingDocs } from '@/lib/google-service';
import { AIProcessor } from '@/src/AIProcessor';

export async function POST(request) {
  
  try {
    // 1. Get form data
    const data = await request.json();
    console.log('Received data:', data);
    const { userInfo, competitors, metricPreferences } = data;
        
    // 2. Validate the data
    if (!userInfo?.email || !competitors?.length) {
      console.log('Validation failed:', { userInfo, competitors });
      return Response.json (
               { success: false, message: 'Missing required fields' },
               { status: 400 }
      );
    }

    // 3. Connect to database
    console.log('Connecting to database...');
    const { db } = await connectToDatabase()
    console.log('Connected to database');  

    // 4.Create Google docs
    const documentLinks = await createTrackingDocs(userInfo.email);

    // 5. Create tracking record
    const trackingRecord = {
      userId: userInfo.email,
      competitors: competitors.map(comp => ({
        ...comp,
        lastUpdated: new Date(),
        status: 'pending'
      })),
      metricPreferences,
      documentLinks,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('Created tracking record:', trackingRecord);

    // 5. Save to database
    const result = await db.collection('trackings').insertOne(trackingRecord);
    console.log('Saved to database:', result);

    const aiProcessor = new AIProcessor();
    
    // 6. Generate initial analysis
    console.log('Generating analysis...');
    const analysis = await aiProcessor.analyzeContext({
      companyDetails: userInfo.companyDetails,
      industry: userInfo.industry,
      competitors
    });
    console.log('Analysis generated');

    // 7. Return success response
    return Response.json({
       success: true,
       message: 'Tracking setup completed',
       trackingId: result.insertedId,
       documentLinks,
       analysis
    });

  } catch (error) {
    console.error('Error in submit-tracking:', {
     error: error.message,
     stack: error.stack,
     type: error.constructor.name
    });
    return Response.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
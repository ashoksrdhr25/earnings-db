// app/api/verify-email/route.ts

import { UserTracking } from '@/lib/models/UserTracking';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Look up existing tracking data
    const existingTracking = await UserTracking.findOne({ email });
    
    if (!existingTracking) {
      return Response.json({ 
        success: true, 
        exists: false 
      });
    }

    return Response.json({
      success: true,
      exists: true,
      data: {
        competitors: existingTracking.competitors,
        documentLinks: existingTracking.documentLinks,
        companyDetails: existingTracking.companyDetails,
        metricPreferences: existingTracking.metricPreferences
      }
    });

  } catch (error) {
    console.error('Error in verify-email:', error);
    return Response.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
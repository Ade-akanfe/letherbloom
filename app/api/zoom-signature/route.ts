// import { NextResponse } from 'next/server';
// import crypto from 'crypto';

// export async function POST(request: Request) {
//     try {
//         const { meetingNumber, role = 0 } = await request.json();

//         if (!meetingNumber) {
//             return NextResponse.json({ error: 'Meeting number is required' }, { status: 400 });
//         }

//         const sdkKey = process.env.ZOOM_CLIENT_ID;
//         const sdkSecret = process.env.ZOOM_CLIENT_SECRET;

//         if (!sdkKey || !sdkSecret) {
//             console.error('Zoom credentials missing');
//             return NextResponse.json({ error: 'Zoom credentials not configured' }, { status: 500 });
//         }

//         const iat = Math.round(new Date().getTime() / 1000) - 30;
//         const exp = iat + 60 * 60 * 2; // 2 hours

//         // Sanitize meeting number
//         const cleanMeetingNumber = meetingNumber.toString().replace(/[\s-]/g, '');

//         const oPayload = {
//             appKey: sdkKey, // Use appKey (clientId) as per newer SDK requirements
//             mn: parseInt(cleanMeetingNumber, 10),
//             role: parseInt(role.toString(), 10),
//             iat: iat,
//             exp: exp,
//             tokenExp: exp
//         };

//         const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
//         const payload = Buffer.from(JSON.stringify(oPayload)).toString('base64url');
//         const signature = crypto
//             .createHmac('sha256', sdkSecret)
//             .update(`${header}.${payload}`)
//             .digest('base64url');

//         const jwt = `${header}.${payload}.${signature}`;

//         return NextResponse.json({ signature: jwt, sdkKey });
//     } catch (err) {
//         console.error('Zoom Signature Error:', err);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }



import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { meetingNumber, role = 0 } = await req.json();

  const clientId = process.env.ZOOM_CLIENT_ID!;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET!;

  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const payload = {
    appKey: clientId,
    mn: Number(meetingNumber),
    role: Number(role),
    iat,
    exp,
    tokenExp: exp,
  };

  const header = { alg: 'HS256', typ: 'JWT' };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', clientSecret)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');

  return NextResponse.json({
    signature: `${base64Header}.${base64Payload}.${signature}`,
    sdkKey: clientId,
  });
}

import {NextResponse} from "next/server";

// api => /api/logout
export async function GET() {
  const response = NextResponse.json({
    code: 0,
    msg: 'Logout successful.'
  });

  response.cookies.delete('token');
  response.headers.delete('token');
  return response;
}

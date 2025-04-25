import {NextRequest, NextResponse} from "next/server";
import {Uuid} from 'js-func-tools';
import {addUser} from '@/db/users';

// api => /api/login
export async function POST(req: NextRequest) {
  let token = req.cookies.get('token')?.value;
  const data = await req.json();
  const user = await addUser({
    id: Uuid(10),
    address: data.address,
    timestamp: Date.now(),
  });
  const response = NextResponse.json({
    code: 0,
    id: user.id,
    address: user.address,
    msg: 'Login successful.'
  });

  if (!token) {
    token = Uuid(64);
    response.cookies.set('token', token, {path: '/', maxAge: 86400, httpOnly: true});
    response.headers.set('Authorization', `Bearer ${token}`);
  }
  return response;
}

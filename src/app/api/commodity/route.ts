import {NextRequest, NextResponse} from "next/server";
import {getCommodityList} from '@/db/commodity';

// api => /api/commodity
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  console.log(555,id);
  const list = await getCommodityList(id);
  return NextResponse.json({
    code: 0,
    msg: '',
    data: list
  });
}

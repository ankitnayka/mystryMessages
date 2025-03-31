import ImageKit from "imagekit"
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {

  const getAuthenticationParameters=imagekit.getAuthenticationParameters()
  try {
    return NextResponse.json(getAuthenticationParameters);
    
  } catch (error:any) {
      return NextResponse.json({
        error:"Imagekit auth fail"
      },{
        status:500
      })
  }
}
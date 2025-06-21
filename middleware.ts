// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	const isVerified = request.cookies.get('face_verified')?.value
	if (!isVerified && request.nextUrl.pathname.startsWith('/success')) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

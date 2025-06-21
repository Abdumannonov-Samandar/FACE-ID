/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, CheckCircle, XCircle, Scan } from 'lucide-react'

export default function FaceIdPage() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const imgRef = useRef<HTMLImageElement>(null)
	const labeledDescriptorRef = useRef<faceapi.LabeledFaceDescriptors | null>(
		null
	)

	const [matchStatus, setMatchStatus] = useState<null | {
		label: string
		distance: number
	}>()
	const [isMatching, setIsMatching] = useState(false)
	const [matchPercentage, setMatchPercentage] = useState(0)
	const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


	const router = useRouter()

	useEffect(() => {
		const loadModels = async () => {
			const MODEL_URL = '/models'
			await Promise.all([
				faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
				faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
				faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
			])
			startCamera()
		}

		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: 'user' },
				})
				if (videoRef.current) {
					videoRef.current.srcObject = stream

					videoRef.current.oncanplay = () => {
						setIsLoading(false)
					}
				}
			} catch (err) {
				alert('Kamera ruxsat berilmagan. Iltimos, ruxsat bering.')
				console.error(err)
			}
		}
    

		loadModels()
	}, [])

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file || !imgRef.current) return

		const imageURL = URL.createObjectURL(file)
		imgRef.current.src = imageURL

		imgRef.current.onload = async () => {
			const detection = await faceapi
				.detectSingleFace(
					imgRef.current!,
					new faceapi.TinyFaceDetectorOptions()
				)
				.withFaceLandmarks()
				.withFaceDescriptor()

			if (!detection) return alert('Yuz topilmadi')

			labeledDescriptorRef.current = new faceapi.LabeledFaceDescriptors(
				'Foydalanuvchi',
				[detection.descriptor]
			)
			setIsImageUploaded(true)
		}
	}

	useEffect(() => {
		const interval = setInterval(async () => {
			if (
				!videoRef.current ||
				!labeledDescriptorRef.current ||
				videoRef.current.readyState !== 4
			)
				return

			setIsMatching(true)

			const detection = await faceapi
				.detectSingleFace(
					videoRef.current,
					new faceapi.TinyFaceDetectorOptions()
				)
				.withFaceLandmarks()
				.withFaceDescriptor()

			if (detection) {
				const matcher = new faceapi.FaceMatcher(labeledDescriptorRef.current)
				const result = matcher.findBestMatch(detection.descriptor)

				const distance = Number.parseFloat(result.distance.toFixed(4))
				const percentage = Math.round((1 - distance) * 100)

				setMatchStatus({ label: result.label, distance })
				setMatchPercentage(percentage)

				if (result.label === 'Foydalanuvchi' && distance < 0.5) {
					router.push('/success')
				}
			}
			setIsMatching(false)
		}, 1000)

		return () => clearInterval(interval)
	}, [router])

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden'>
			{/* Animated Background Elements */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob'></div>
				<div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000'></div>
				<div className='absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000'></div>
			</div>

			<div className='max-w-6xl mx-auto space-y-8 relative z-10'>
				{/* Header */}
				<div className='text-center space-y-4'>
					
					<h1 className='text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
						Face Recognition System
					</h1>
					<p className='text-gray-300 text-lg'>
						Ilg&apos;or yuz tanish va xavfsizlik tizimi
					</p>
				</div>

				{/* Redirect Animation */}

				<div className='grid lg:grid-cols-2 gap-8'>
					{/* Video Feed Card */}
					<Card className='bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-2 border-none'>
						{/* <CardHeader className='pb-4'>
							<CardTitle className='flex items-center gap-3 text-white text-xl'>
								Jonli Video Oqimi
							</CardTitle>
						</CardHeader> */}
						<CardContent className='space-y-6'>
							<div className='relative group'>
								{isLoading && (
									<div className='absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10'>
										<div className='text-center space-y-4'>
											<div className='w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto'></div>
											<p className='text-white font-medium'>
												Kamera yuklanmoqda...
											</p>
										</div>
									</div>
								)}

								<div className='relative overflow-hidden rounded-2xl shadow-2xl'>
									<video
										ref={videoRef}
										autoPlay
										muted
										playsInline
										className='w-full h-100 object-cover transform group-hover:scale-105 transition-transform duration-500'
									/>

									{/* Scanning Animation Overlay */}
									{isMatching && (
										<div className='absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse'>
											<div className='absolute inset-0 border-2 border-blue-400 rounded-2xl animate-ping'></div>
										</div>
									)}
								</div>

								{/* Real-time status indicator */}
								{isMatching && (
									<div className='absolute top-4 right-4 z-20'>
										<div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg animate-bounce'>
											<Scan className='w-4 h-4 animate-spin' />
											Skanlanmoqda...
										</div>
									</div>
								)}
							</div>

							{/* Match Result */}
							{matchStatus && (
								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<span className='text-white font-medium'>Natija:</span>
										<Badge
											className={`px-4 py-2 text-sm font-bold shadow-lg transform hover:scale-105 transition-all duration-300 ${
												matchStatus.label === 'Foydalanuvchi' && matchStatus.distance < 0.5
													? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
													: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
											}`}
										>
											{matchStatus.label === 'Foydalanuvchi' && matchStatus.distance < 0.5 ? (
												<CheckCircle className='w-4 h-4 mr-2' />
											) : (
												<XCircle className='w-4 h-4 mr-2' />
											)}
											{matchStatus.label}
										</Badge>
									</div>

									<div className='bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-inner'>
										<div className='flex items-center justify-between mb-4'>
											<span className='text-white font-medium'>
												Aniqlik darajasi:
											</span>
											<span
												className={`text-2xl font-bold ${
													matchPercentage >= 90
														? 'text-green-400'
														: matchPercentage >= 70
														? 'text-yellow-400'
														: 'text-red-400'
												}`}
											>
												{matchPercentage}%
											</span>
										</div>

										<div className='relative bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner'>
											<div
												className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
													matchPercentage >= 90
														? 'bg-gradient-to-r from-green-400 to-emerald-500'
														: matchPercentage >= 70
														? 'bg-gradient-to-r from-yellow-400 to-orange-500'
														: 'bg-gradient-to-r from-red-400 to-pink-500'
												}`}
												style={{ width: `${Math.max(5, matchPercentage)}%` }}
											>
												<div className='absolute inset-0 bg-white/30 animate-pulse'></div>
											</div>
										</div>

										{matchPercentage >= 100 && (
											<div className='mt-4 text-center'>
												<div className='inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce'>
													<CheckCircle className='w-4 h-4' />
													Mukammal mos kelish!
												</div>
											</div>
										)}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Upload Card */}
					<Card className='bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 transform hover:-translate-y-2'>
						{/* <CardHeader className='pb-4'>
							<CardTitle className='flex items-center gap-3 text-white text-xl'>
								Image Upload
							</CardTitle>
						</CardHeader> */}
						<CardContent className='space-y-6'>
							<div className='border-2 border-dashed border-white/30 rounded-2xl p-8 text-center hover:border-white/50 transition-all duration-300 bg-white/5 backdrop-blur-sm group hover:bg-white/10'>
								<div className='transform group-hover:scale-110 transition-transform duration-300'>
									<Upload className='w-16 h-16 text-white/60 mx-auto mb-4' />
								</div>
								<div className='space-y-3'>
									<p className='text-lg font-medium text-white'>
										Taqqoslanadigan rasmni yuklang
									</p>
									<p className='text-sm text-white/60'>
										PNG, JPG yoki JPEG formatida
									</p>
								</div>
								<Button
									asChild
									className='mt-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300'
								>
									<label className='cursor-pointer'>
										<input
											type='file'
											accept='image/*'
											onChange={handleImageUpload}
											className='hidden'
										/>
										Image Select
									</label>
								</Button>
							</div>

							{/* Upload Status */}
							{isImageUploaded && (
								<div className='bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6 shadow-lg'>
									<div className='flex items-center gap-3 mb-2'>
										<div className='p-2 bg-green-500 rounded-full'>
											<CheckCircle className='w-5 h-5 text-white' />
										</div>
										<span className='text-lg font-bold text-green-400'>
											Rasm muvaffaqiyatli yuklandi
										</span>
									</div>
									<p className='text-green-300 text-sm'>
										Endi video orqali yuzingizni solishtiring
									</p>
								</div>
							)}

							{!isImageUploaded && (
								<div className='bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 shadow-lg'>
									<div className='flex items-center gap-3 mb-2'>
										<div className='p-2 bg-amber-500 rounded-full animate-pulse'>
											<Upload className='w-5 h-5 text-white' />
										</div>
										<span className='text-lg font-bold text-amber-400'>
											Rasm yuklanmagan
										</span>
									</div>
									<p className='text-amber-300 text-sm'>
										Solishtirish uchun avval rasm yuklang
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Hidden image element */}
				<img ref={imgRef} hidden alt='Yuklangan rasm' />
			</div>

			<style jsx>{`
				@keyframes blob {
					0% {
						transform: translate(0px, 0px) scale(1);
					}
					33% {
						transform: translate(30px, -50px) scale(1.1);
					}
					66% {
						transform: translate(-20px, 20px) scale(0.9);
					}
					100% {
						transform: translate(0px, 0px) scale(1);
					}
				}
				.animate-blob {
					animation: blob 7s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>
		</div>
	)
}

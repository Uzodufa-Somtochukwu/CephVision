"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import LoginForm from "@/components/auths/loginForm";
import { cephLoginImage } from "@/public/images";


const LoginPage = () => {
	return (
		<div className="min-h-screen rounded-md">
			<div className="hidden md:flex h-[100vh] flex-row">
				<div className="relative flex-1 bg-black  inset-0 text-white p-6 md:p-12">
					<Image
						src={cephLoginImage}
						alt="L-1"
						fill
						className="object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-300"
						priority
					/>
					<div className="absolute bottom-16 tracking-widest left-1/2 transform -translate-x-1/2 text-center">
						<h1 className="text-4xl font-bold mb-4">CephVision</h1>
						<AnimatePresence mode="wait">
							<motion.p
								key="description"
								className="text-lg whitespace-nowrap overflow-hidden"
								initial={{ width: 0 }}
								animate={{ width: "100%" }}
								exit={{ width: 0 }}
								transition={{
									duration: 2,
									ease: "easeInOut",
								}}
							>
								<span className="inline-block">
									Ceph analysis made easy...
								</span>
							</motion.p>
						</AnimatePresence>
						<AnimatePresence mode="wait">
							<motion.p
								key="partnership"
								className="text-sm mt-2 whitespace-nowrap overflow-hidden"
								initial={{ width: 0 }}
								animate={{ width: "100%" }}
								exit={{ width: 0 }}
								transition={{
									duration: 2,
									ease: "easeInOut",
									delay: 0.5,
								}}
							>
								<span className="inline-block">
									We handle the heavy lifting for you while you interact with your patients 
								</span>
							</motion.p>
						</AnimatePresence>
					</div>
				</div>

				<div className="flex-1 bg-gray-100 h-[100vh] overflow-y-auto p-6  flex w-full">
					<LoginForm />
				</div>
			</div>

			<div className="lg:hidden min-h-screen relative bg-gray-900">
				<Image
					src={cephLoginImage}
					alt="l-2"
					fill
					className="object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-300"
					priority
				/>
				<div className="relative z-10 p-2 flex items-center justify-center">
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default LoginPage;

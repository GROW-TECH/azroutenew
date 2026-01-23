"use client";

export default function PricingPage() {
  const plans = [
    {
      title: "Beginner",
      price: "₹1,999/month",
      description: "Perfect for beginners starting their chess journey.",
      features: [
        "4 weekly classes",
        "AI training tools",
        "Weekend online tournaments",
        "Stage completion certificate",
        "Performance tracking dashboard",
      ],
      color: "blue"
    },
    {
      title: "Intermediate",
      price: "₹2,999/month",
      description: "Ideal for kids who know basics and want structured improvement.",
      features: [
        "8 weekly classes",
        "Advanced AI tools",
        "Detailed game analysis",
        "Tournament preparation",
        "Stage completion certificate"
      ],
      color: "purple"
    },
    {
      title: "Advanced",
      price: "₹3,999/month",
      description: "For serious learners aiming for competitive excellence.",
      features: [
        "12 weekly classes",
        "Professional-level training",
        "Deep analysis with coaches",
        "FIDE-level study material",
        "Stage completion certificate"
      ],
      color: "red"
    },
  ];

  
}

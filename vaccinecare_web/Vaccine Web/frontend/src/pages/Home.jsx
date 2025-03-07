import React, { useEffect } from "react";
import Navigation from "./Navigation";
import { useGetAdminDeshboardQuery } from "@/features/api/authApi";
import { motion } from "framer-motion";
import {
  Users,
  Hospital,
  Baby,
  Syringe,
  Calendar,
  Shield,
  Activity,
  Heart,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const Home = () => {
  const { data: dashboardData ,refetch} = useGetAdminDeshboardQuery();

  useEffect(() => { 
    refetch();
  } , [])
  

  const vaccineDetails = [
    {
      name: "BCG (Bacillus Calmette-Guérin)",
      age: "At Birth",
      protectsAgainst: "Tuberculosis",
      description: "Protects against severe forms of tuberculosis, particularly TB meningitis and miliary TB in children.",
      sideEffects: "Small red bump at injection site that may leave a small scar",
      effectiveness: "70-80% effective in preventing severe forms of TB",
      importance: "Critical in countries where TB is prevalent, prevents severe childhood TB",
    },
    {
      name: "Hepatitis B (HBV)",
      age: "At Birth, 6 weeks, 10 weeks",
      protectsAgainst: "Hepatitis B virus infection",
      description: "Prevents liver infection that can lead to chronic conditions including liver cancer.",
      sideEffects: "Soreness at injection site, mild fever",
      effectiveness: "95% effective in preventing infection",
      importance: "Prevents chronic liver disease and liver cancer",
    },
    {
      name: "OPV/IPV (Polio Vaccine)",
      age: "Birth, 6 weeks, 10 weeks, 14 weeks",
      protectsAgainst: "Poliomyelitis",
      description: "Protects against poliovirus types 1, 2, and 3 that can cause paralysis.",
      sideEffects: "Very rare side effects, extremely safe",
      effectiveness: "99% effective after recommended doses",
      importance: "Essential for global polio eradication efforts",
    },
    {
      name: "DTwP/DTaP",
      age: "6 weeks, 10 weeks, 14 weeks",
      protectsAgainst: "Diphtheria, Tetanus, Pertussis",
      description: "Triple protection against three severe bacterial infections.",
      sideEffects: "Mild fever, soreness at injection site",
      effectiveness: "85-95% effective in preventing diseases",
      importance: "Prevents potentially fatal childhood diseases",
    },
    {
      name: "Hib",
      age: "6 weeks, 10 weeks, 14 weeks",
      protectsAgainst: "Haemophilus influenzae type b",
      description: "Prevents bacterial infections causing meningitis, pneumonia, and other serious illnesses.",
      sideEffects: "Redness at injection site, mild fever",
      effectiveness: "95-100% effective after complete series",
      importance: "Prevents severe bacterial infections in young children",
    },
    {
      name: "PCV (Pneumococcal Conjugate Vaccine)",
      age: "6 weeks, 10 weeks, 14 weeks",
      protectsAgainst: "Streptococcus pneumoniae",
      description: "Protects against pneumococcal disease causing pneumonia, meningitis, and blood infections.",
      sideEffects: "Mild tenderness, swelling at injection site",
      effectiveness: "Over 90% effective against invasive disease",
      importance: "Crucial for preventing pneumococcal diseases",
    },
    {
      name: "Rotavirus Vaccine",
      age: "6 weeks, 10 weeks, 14 weeks",
      protectsAgainst: "Rotavirus infection",
      description: "Prevents severe diarrhea in infants and young children.",
      sideEffects: "Mild irritability, temporary diarrhea",
      effectiveness: "85-98% effective against severe disease",
      importance: "Prevents dehydration and hospitalization from rotavirus",
    },
    {
      name: "MMR",
      age: "9 months, 15 months",
      protectsAgainst: "Measles, Mumps, Rubella",
      description: "Protects against three common viral infections that can have serious complications.",
      sideEffects: "Mild fever, rash, temporary joint pain",
      effectiveness: "97% effective after two doses",
      importance: "Prevents outbreaks and protects vulnerable populations",
    },
    {
      name: "Varicella",
      age: "15 months",
      protectsAgainst: "Chickenpox",
      description: "Prevents chickenpox infection and its complications.",
      sideEffects: "Mild rash, low-grade fever",
      effectiveness: "90% effective in preventing chickenpox",
      importance: "Prevents severe complications of chickenpox",
    },
    {
      name: "Hepatitis A",
      age: "12 months, 18 months",
      protectsAgainst: "Hepatitis A virus infection",
      description: "Prevents liver infection that can cause severe illness.",
      sideEffects: "Soreness at injection site, headache",
      effectiveness: "95% effective after two doses",
      importance: "Prevents liver disease and its complications",
    },
  ];

  // Benefits of vaccination
  const vaccinationBenefits = [
    {
      title: "Disease Prevention",
      description: "Vaccines prevent an estimated 2-3 million deaths every year from diseases like diphtheria, tetanus, pertussis, influenza and measles.",
      icon: Shield,
    },
    {
      title: "Community Protection",
      description: "When enough people are vaccinated, it helps protect those who cannot be vaccinated through herd immunity.",
      icon: Users,
    },
    {
      title: "Cost-Effective Healthcare",
      description: "Vaccination is one of the most cost-effective health investments, reducing healthcare costs and promoting economic growth.",
      icon: Activity,
    },
    {
      title: "Child Development",
      description: "Protects children during critical development periods, ensuring healthy growth and development.",
      icon: Baby,
    },
    {
      title: "Global Health Security",
      description: "Helps prevent epidemics and reduces the risk of disease outbreaks globally.",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Understanding Vaccination
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the importance of timely vaccination and how it protects our children and communities from preventable diseases.
            </p>
          </motion.div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-sm">
                <Hospital className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{dashboardData?.hospitals_count || 0}</h3>
                <p className="text-gray-600">Vaccination Centers</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-sm">
                <Users className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{dashboardData?.workers_count || 0}</h3>
                <p className="text-gray-600">Healthcare Professionals</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl shadow-sm">
                <Baby className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{dashboardData?.vaccine_records_count || 0}</h3>
                <p className="text-gray-600">vaccine given</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Importance of Vaccination */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Benefits of Vaccination</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Vaccination is one of the most successful and cost-effective public health interventions in history.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vaccinationBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <benefit.icon className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Vaccine Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Comprehensive Vaccine Guide</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Detailed information about each vaccine, their effects, and importance in child immunization.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {vaccineDetails.map((vaccine, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-white p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Syringe className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">{vaccine.name}</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                        <span><strong>Timing:</strong> {vaccine.age}</span>
                      </div>

                      <div className="flex items-start text-gray-600">
                        <Shield className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          <strong>Protects Against:</strong>
                          <p>{vaccine.protectsAgainst}</p>
                        </div>
                      </div>

                      <div className="flex items-start text-gray-600">
                        <Info className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                          <strong>Description:</strong>
                          <p>{vaccine.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong className="text-gray-700 block mb-1">Side Effects:</strong>
                          <p className="text-gray-600 text-sm">{vaccine.sideEffects}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <strong className="text-gray-700 block mb-1">Effectiveness:</strong>
                          <p className="text-gray-600 text-sm">{vaccine.effectiveness}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-1" />
                          <p className="text-gray-700"><strong>Why it's important:</strong> {vaccine.importance}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Key Facts About Vaccination */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Important Facts About Vaccination</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Understanding these key facts helps make informed decisions about vaccination.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Safe and Tested",
                  description: "Vaccines undergo rigorous safety testing and continuous monitoring to ensure their safety and effectiveness.",
                },
                {
                  title: "Strengthens Immunity",
                  description: "Vaccines work with your body's natural defenses to build protection against specific diseases.",
                },
                {
                  title: "Prevents Outbreaks",
                  description: "High vaccination rates help prevent disease outbreaks in communities.",
                },
                {
                  title: "Saves Lives",
                  description: "Vaccination prevents an estimated 2-3 million deaths every year worldwide.",
                },
              ].map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{fact.title}</h3>
                      <p className="text-gray-600">{fact.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Concerns Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Addressing Common Concerns</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Get accurate information about common vaccination concerns.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  question: "Are vaccines safe for newborns?",
                  answer: "Yes, vaccines are specially formulated and thoroughly tested for safety in infants. The benefits far outweigh any risks.",
                },
                {
                  question: "Can vaccines cause the disease they prevent?",
                  answer: "No, vaccines contain either killed or weakened forms of germs that cannot cause the disease they prevent.",
                },
                {
                  question: "Why are multiple doses needed?",
                  answer: "Multiple doses are needed for some vaccines to build strong immunity and ensure long-lasting protection.",
                },
              ].map((concern, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm"
                >
                  <AlertCircle className="h-6 w-6 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-3">{concern.question}</h3>
                  <p className="text-gray-600">{concern.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Access reliable resources and stay updated with the latest vaccination guidelines and information.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <p className="text-gray-600">
                  For more information, visit your local healthcare provider or consult official health organizations.
                </p>
                <p className="text-sm text-gray-500">
                  Always consult with healthcare professionals for personalized medical advice.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Vaccine Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

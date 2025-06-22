
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Mail } from 'lucide-react';

export const Team = () => {
  return (
    <div id="team" className="container mx-auto px-4 py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Meet the Team
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Built by experienced professionals passionate about empowering others through better negotiation skills.
        </p>
      </div>

      <div className="flex justify-center">
        <Card className="max-w-sm bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-gradient-to-br from-blue-500 to-purple-600">
              <img 
                src="/lovable-uploads/8a843894-388c-4b2e-a362-527b80860fb5.png" 
                alt="Himanshu Ragarwal"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Himanshu Ragarwal</h3>
            <p className="text-blue-600 font-medium mb-3">Founder & CEO</p>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Ex-software engineer, ex-VC and operator with early-stage startup experience of 4+ years. Building AI-powered tools that help professionals excel in their careers through better communication and negotiation skills.
            </p>
            
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.linkedin.com/in/himanshu-ragarwal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Linkedin className="h-4 w-4" />
                Connect
              </a>
              <a 
                href="mailto:contact@verbalize.ai"
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

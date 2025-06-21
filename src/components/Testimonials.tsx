
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Tech Corp",
      content: "Confidant AI helped me negotiate a 25% salary increase! The practice sessions gave me the confidence to present my case effectively.",
      rating: 5,
      scenario: "Salary Negotiation"
    },
    {
      name: "Marcus Rodriguez",
      role: "Business Development",
      company: "StartupXYZ",
      content: "The AI personas are incredibly realistic. I practiced difficult client negotiations and it translated directly to real-world success.",
      rating: 5,
      scenario: "Business Deals"
    },
    {
      name: "Jennifer Park",
      role: "Freelance Designer",
      company: "Independent",
      content: "I used to undervalue my work, but after practicing with Confidant AI, I confidently raised my rates by 40%. Game changer!",
      rating: 5,
      scenario: "Freelance Pricing"
    },
    {
      name: "David Thompson",
      role: "Sales Manager",
      company: "Enterprise Inc",
      content: "The instant feedback is incredibly detailed. I learned specific techniques that I now use in every negotiation. Highly recommended!",
      rating: 5,
      scenario: "Customer Service"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Success Stories
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how professionals like you have transformed their negotiation skills with Confidant AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {testimonial.scenario}
                </Badge>
              </div>
              
              <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Card className="bg-white shadow-lg border-0 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Average Results</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">32%</div>
                <div className="text-sm text-gray-600">Average Salary Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">User Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

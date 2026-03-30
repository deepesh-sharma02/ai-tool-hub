from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import json

career_bp = Blueprint('career', __name__)

# Comprehensive career data
CAREER_DATABASE = {
    'tech': {
        '10th': {
            'paths': [
                'Complete 12th with PCM (Physics, Chemistry, Mathematics)',
                'Pursue ITI in Computer Hardware/Software',
                'Diploma in Computer Science/IT'
            ],
            'skills': ['Basic Computer Skills', 'Mathematics', 'Logical Thinking'],
            'resources': [
                {'name': 'NPTEL - Computer Science Courses', 'url': 'https://nptel.ac.in', 'type': 'Free Online Course'},
                {'name': 'Code.org', 'url': 'https://code.org', 'type': 'Learn Programming'},
                {'name': 'Khan Academy - Computer Programming', 'url': 'https://khanacademy.org', 'type': 'Free Tutorials'}
            ],
            'timeline': '2-3 years for diploma, 5-6 years for degree'
        },
        '12th': {
            'paths': [
                'B.Tech/BE in Computer Science',
                'BCA (Bachelor of Computer Applications)',
                'B.Sc in IT/Computer Science',
                'Diploma in Software Development'
            ],
            'skills': ['Programming (Python, Java)', 'Data Structures', 'Web Development'],
            'resources': [
                {'name': 'IIT Madras Online Degree', 'url': 'https://onlinedegree.iitm.ac.in', 'type': 'Online Degree'},
                {'name': 'Coursera - Computer Science', 'url': 'https://coursera.org', 'type': 'MOOCs'},
                {'name': 'freeCodeCamp', 'url': 'https://freecodecamp.org', 'type': 'Free Coding Bootcamp'}
            ],
            'timeline': '3-4 years for degree'
        },
        'graduate': {
            'paths': [
                'Software Developer',
                'Data Scientist',
                'Web Developer',
                'Mobile App Developer',
                'Cloud Engineer',
                'Cybersecurity Specialist'
            ],
            'skills': ['Full Stack Development', 'Machine Learning', 'Cloud Computing (AWS/Azure)', 'DevOps'],
            'resources': [
                {'name': 'GeeksforGeeks', 'url': 'https://geeksforgeeks.org', 'type': 'Interview Prep'},
                {'name': 'LeetCode', 'url': 'https://leetcode.com', 'type': 'Coding Practice'},
                {'name': 'Udacity - Tech Nanodegrees', 'url': 'https://udacity.com', 'type': 'Specialized Courses'}
            ],
            'timeline': 'Job-ready in 6-12 months with skills'
        }
    },
    'medical': {
        '10th': {
            'paths': [
                'Complete 12th with PCB (Physics, Chemistry, Biology)',
                'Score well in board exams',
                'Start NEET preparation'
            ],
            'skills': ['Biology', 'Chemistry', 'Physics', 'Memory & Retention'],
            'resources': [
                {'name': 'NCERT Solutions', 'url': 'https://ncert.nic.in', 'type': 'Official Textbooks'},
                {'name': 'Khan Academy - Biology', 'url': 'https://khanacademy.org', 'type': 'Free Videos'},
                {'name': 'Byju\'s Free Classes', 'url': 'https://byjus.com', 'type': 'Online Classes'}
            ],
            'timeline': '2 years (11th & 12th)'
        },
        '12th': {
            'paths': [
                'MBBS (Medical Doctor)',
                'BDS (Dental)',
                'BAMS (Ayurveda)',
                'BHMS (Homeopathy)',
                'B.Pharm (Pharmacy)',
                'BSc Nursing'
            ],
            'skills': ['NEET Preparation', 'Patient Care', 'Medical Terminology'],
            'resources': [
                {'name': 'NEET Official Website', 'url': 'https://nta.ac.in', 'type': 'Exam Info'},
                {'name': 'Allen/Aakash Free Resources', 'url': 'https://allen.in', 'type': 'NEET Prep'},
                {'name': 'Marrow - Medical Prep', 'url': 'https://marrow.me', 'type': 'Online Coaching'}
            ],
            'timeline': '5.5 years for MBBS, 4 years for others'
        },
        'graduate': {
            'paths': [
                'Medical Officer',
                'Specialist Doctor (MD/MS)',
                'Medical Researcher',
                'Healthcare Administrator'
            ],
            'skills': ['Clinical Skills', 'Patient Management', 'Research'],
            'resources': [
                {'name': 'Medical Council of India', 'url': 'https://mciindia.org', 'type': 'Licensing Info'},
                {'name': 'PubMed', 'url': 'https://pubmed.ncbi.nlm.nih.gov', 'type': 'Medical Research'},
                {'name': 'Medscape', 'url': 'https://medscape.com', 'type': 'Medical Education'}
            ],
            'timeline': '3 years for MD/MS'
        }
    },
    'govt': {
        '10th': {
            'paths': [
                'Railway Group D',
                'SSC Stenographer',
                'State Police Constable',
                'Armed Forces (Technical)'
            ],
            'skills': ['General Knowledge', 'Mathematics', 'Reasoning', 'Physical Fitness'],
            'resources': [
                {'name': 'Sarkari Result', 'url': 'https://sarkariresult.com', 'type': 'Job Notifications'},
                {'name': 'Railway Official', 'url': 'https://rrbonlinereg.co.in', 'type': 'Railway Jobs'},
                {'name': 'Gradeup - Free Prep', 'url': 'https://gradeup.co', 'type': 'Exam Preparation'}
            ],
            'timeline': '6-12 months preparation'
        },
        '12th': {
            'paths': [
                'SSC CGL',
                'SSC CHSL',
                'Railway NTPC',
                'Bank PO/Clerk',
                'State Government Jobs'
            ],
            'skills': ['Quantitative Aptitude', 'English', 'General Awareness', 'Reasoning'],
            'resources': [
                {'name': 'SSC Official', 'url': 'https://ssc.nic.in', 'type': 'Official Website'},
                {'name': 'Testbook', 'url': 'https://testbook.com', 'type': 'Mock Tests'},
                {'name': 'Adda247', 'url': 'https://adda247.com', 'type': 'Exam Prep'}
            ],
            'timeline': '1-2 years preparation'
        },
        'graduate': {
            'paths': [
                'UPSC Civil Services (IAS/IPS)',
                'State PCS',
                'Bank PO',
                'Railway RRB',
                'Defence Services (CDS/AFCAT)'
            ],
            'skills': ['Current Affairs', 'Essay Writing', 'Interview Skills', 'Subject Knowledge'],
            'resources': [
                {'name': 'UPSC Official', 'url': 'https://upsc.gov.in', 'type': 'UPSC Info'},
                {'name': 'Unacademy - Free Classes', 'url': 'https://unacademy.com', 'type': 'Online Coaching'},
                {'name': 'Study IQ Education', 'url': 'https://studyiq.com', 'type': 'Free Videos'}
            ],
            'timeline': '2-3 years for UPSC, 1 year for others'
        }
    },
    'business': {
        '10th': {
            'paths': [
                'Complete 12th with Commerce',
                'Learn basic accounting',
                'Start small business ideas'
            ],
            'skills': ['Basic Accounting', 'Communication', 'Sales', 'Customer Service'],
            'resources': [
                {'name': 'Startup India', 'url': 'https://startupindia.gov.in', 'type': 'Government Support'},
                {'name': 'MSME Registration', 'url': 'https://udyamregistration.gov.in', 'type': 'Business Registration'},
                {'name': 'YouTube - Business Ideas', 'url': 'https://youtube.com', 'type': 'Free Videos'}
            ],
            'timeline': 'Can start immediately with small ventures'
        },
        '12th': {
            'paths': [
                'B.Com (Commerce)',
                'BBA (Business Administration)',
                'Start own business',
                'Franchise opportunities'
            ],
            'skills': ['Financial Literacy', 'Marketing', 'Business Planning', 'Digital Marketing'],
            'resources': [
                {'name': 'Google Digital Unlocked', 'url': 'https://learndigital.withgoogle.com', 'type': 'Free Digital Marketing'},
                {'name': 'NIOS - Open Schooling', 'url': 'https://nios.ac.in', 'type': 'Flexible Education'},
                {'name': 'Skill India', 'url': 'https://skillindia.gov.in', 'type': 'Skill Development'}
            ],
            'timeline': '3 years for degree, business can start anytime'
        },
        'graduate': {
            'paths': [
                'Entrepreneur',
                'MBA (Management)',
                'CA (Chartered Accountant)',
                'Business Consultant',
                'E-commerce Business'
            ],
            'skills': ['Leadership', 'Financial Management', 'Strategic Planning', 'Networking'],
            'resources': [
                {'name': 'ICAI - CA Resources', 'url': 'https://icai.org', 'type': 'CA Course'},
                {'name': 'IIM Online Courses', 'url': 'https://emeritus.org', 'type': 'MBA Programs'},
                {'name': 'Amazon Seller', 'url': 'https://sell.amazon.in', 'type': 'E-commerce Platform'}
            ],
            'timeline': 'MBA: 2 years, CA: 4-5 years'
        }
    },
    'arts': {
        '10th': {
            'paths': [
                'Complete 12th with Arts stream',
                'Learn drawing/painting/music',
                'Develop portfolio'
            ],
            'skills': ['Creativity', 'Drawing', 'Music', 'Writing', 'Design Thinking'],
            'resources': [
                {'name': 'Skillshare', 'url': 'https://skillshare.com', 'type': 'Creative Courses'},
                {'name': 'Drawabox', 'url': 'https://drawabox.com', 'type': 'Free Drawing Lessons'},
                {'name': 'YouTube Art Tutorials', 'url': 'https://youtube.com', 'type': 'Free Videos'}
            ],
            'timeline': 'Continuous practice, portfolio building'
        },
        '12th': {
            'paths': [
                'BFA (Fine Arts)',
                'BA in Design',
                'Film & Media Studies',
                'Fashion Design',
                'Interior Design'
            ],
            'skills': ['Digital Design', 'Adobe Creative Suite', 'Portfolio Development'],
            'resources': [
                {'name': 'NID - Design Resources', 'url': 'https://nid.edu', 'type': 'Design Institute'},
                {'name': 'Behance', 'url': 'https://behance.net', 'type': 'Portfolio Platform'},
                {'name': 'Canva Design School', 'url': 'https://designschool.canva.com', 'type': 'Free Design Courses'}
            ],
            'timeline': '3-4 years for degree'
        },
        'graduate': {
            'paths': [
                'Graphic Designer',
                'UI/UX Designer',
                'Content Creator',
                'Video Editor',
                'Fashion Designer',
                'Interior Designer'
            ],
            'skills': ['Advanced Design Tools', 'Client Management', 'Freelancing'],
            'resources': [
                {'name': 'Dribbble', 'url': 'https://dribbble.com', 'type': 'Design Community'},
                {'name': 'Fiverr', 'url': 'https://fiverr.com', 'type': 'Freelance Platform'},
                {'name': 'Upwork', 'url': 'https://upwork.com', 'type': 'Freelance Jobs'}
            ],
            'timeline': 'Job-ready with strong portfolio'
        }
    }
}

@career_bp.route('/recommend', methods=['POST'])
def get_career_recommendation():
    """
    Get personalized career recommendation based on user profile
    """
    data = request.json
    age = data.get('age')
    interest = data.get('interest', '').lower()
    education = data.get('education', '').lower()
    
    if not all([age, interest, education]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        # Map education levels
        edu_map = {
            '10th': '10th',
            '12th': '12th',
            'graduate': 'graduate',
            'postgrad': 'graduate'
        }
        
        # Map interests
        interest_map = {
            'technology': 'tech',
            'tech': 'tech',
            'medical': 'medical',
            'government job': 'govt',
            'govt': 'govt',
            'business': 'business',
            'arts & creative': 'arts',
            'arts': 'arts'
        }
        
        edu_level = edu_map.get(education, 'graduate')
        career_field = interest_map.get(interest, 'tech')
        
        # Get career data
        career_info = CAREER_DATABASE.get(career_field, {}).get(edu_level, {})
        
        if not career_info:
            return jsonify({'error': 'Career data not found'}), 404
        
        # Generate personalized roadmap
        roadmap = {
            'field': career_field,
            'education_level': edu_level,
            'age': age,
            'current_step': f"You are at {education} level",
            'next_steps': career_info.get('paths', []),
            'required_skills': career_info.get('skills', []),
            'free_resources': career_info.get('resources', []),
            'timeline': career_info.get('timeline', 'Varies'),
            'personalized_advice': generate_personalized_advice(age, career_field, edu_level)
        }
        
        return jsonify(roadmap), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_personalized_advice(age, field, education):
    """Generate personalized career advice"""
    advice = []
    
    if age < 18:
        advice.append("Focus on building strong foundation in your subjects")
        advice.append("Participate in extracurricular activities")
    elif age < 25:
        advice.append("Build practical skills through projects and internships")
        advice.append("Network with professionals in your field")
    else:
        advice.append("Consider skill upgradation and certifications")
        advice.append("Look for career transition opportunities")
    
    if education == '10th':
        advice.append("Choose your 11th stream carefully based on career goals")
    elif education == '12th':
        advice.append("Prepare well for entrance exams")
        advice.append("Research colleges and courses thoroughly")
    else:
        advice.append("Build a strong portfolio or resume")
        advice.append("Start applying for jobs or internships")
    
    return advice

@career_bp.route('/explore/<field>', methods=['GET'])
def explore_career_field(field):
    """
    Get detailed information about a specific career field
    """
    career_data = CAREER_DATABASE.get(field, {})
    
    if not career_data:
        return jsonify({'error': 'Career field not found'}), 404
    
    return jsonify({
        'field': field,
        'levels': career_data
    }), 200

@career_bp.route('/resources', methods=['GET'])
def get_all_resources():
    """
    Get all free resources across all fields
    """
    all_resources = []
    
    for field, levels in CAREER_DATABASE.items():
        for level, data in levels.items():
            resources = data.get('resources', [])
            for resource in resources:
                resource['field'] = field
                resource['level'] = level
                all_resources.append(resource)
    
    return jsonify({'resources': all_resources}), 200

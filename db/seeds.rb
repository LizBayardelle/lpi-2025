# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create sample projects for "See Our Work" page
projects_data = [
  {
    name: "Japanese Language Database",
    short_description: "I want a smart way to study Japanese vocabulary with spaced repetition.",
    what_special: "Custom spaced repetition algorithms that adapt to individual learning patterns. This uses machine learning to optimize review timing and track retention patterns across thousands of vocabulary items with sophisticated backend architecture.",
    long_description: "A sophisticated language learning platform that tracks user progress, implements spaced repetition algorithms, and provides contextual examples. Features include custom study decks, progress analytics, and adaptive difficulty adjustment based on user performance.",
    url: "https://nihongo-database.com"
  },
  {
    name: "The Petulant Poetess",
    short_description: "I want a platform where I can share my writing and connect with other poets.",
    what_special: "Complex user interaction system with critique workflows, submission queues, and community moderation tools. The multi-layered permission system and custom writing tools require sophisticated backend architecture beyond standard solutions.",
    long_description: "A creative writing community platform with custom content management, user profiles, submission systems, and interactive feedback tools. Features include writing prompts, critique circles, and publication workflows.",
    url: "https://thepetulantpoetess.com"
  },
  {
    name: "Linchpin Realty",
    short_description: "I want a real estate website that's actually helpful to people.",
    what_special: "Real-time MLS integration, custom mortgage calculators, and neighborhood analytics with live market data. The property comparison tools and automated valuation models require complex database relationships and API integrations.",
    long_description: "A comprehensive real estate platform with advanced property search, mortgage calculators, neighborhood analytics, and agent collaboration tools. Features custom CRM integration, automated valuation models, and market trend analysis.",
    url: "https://www.linchpinrealty.com"
  },
  {
    name: "TOCA Cares",
    short_description: "I want a way for my employees to help each other in hard times.",
    what_special: "Anonymous request matching system with sophisticated privacy controls and resource allocation algorithms. The peer-to-peer support network requires custom user verification and sensitive data handling that goes far beyond basic CMS capabilities.",
    long_description: "An employee assistance platform that facilitates peer-to-peer support, resource sharing, and community building within organizations. Features include anonymous request systems, resource matching, and impact tracking.",
    url: "https://www.tocacares.com"
  },
  {
    name: "Jane Denison Art",
    short_description: "I want a way to showcase not just my paintings, but also the ideas behind them.",
    what_special: "Interactive story-driven galleries with custom content relationships linking artworks to inspiration, process documentation, and commission workflows. The dynamic presentation system adapts based on viewer preferences and artwork connections.",
    long_description: "A sophisticated artist portfolio platform with custom content management, story-driven presentation, and interactive galleries. Features include process documentation, inspiration boards, and commission management systems.",
    url: "https://www.janedenison.com"
  }
]

puts "Creating projects..."

projects_data.each do |project_data|
  project = Project.find_or_create_by(name: project_data[:name]) do |p|
    p.short_description = project_data[:short_description]
    p.what_special = project_data[:what_special]
    p.long_description = project_data[:long_description]
    p.url = project_data[:url]
    p.published = true
  end
  
  # Update existing projects with new what_special field
  if project.persisted? && project.what_special.blank?
    project.update!(what_special: project_data[:what_special])
  end
  
  puts "Created/Updated: #{project.name}"
end

puts "Finished creating #{Project.count} projects!"

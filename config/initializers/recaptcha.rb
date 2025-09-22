Recaptcha.configure do |config|
  config.site_key = ENV['RECAPTCHA_SITE_KEY']
  config.secret_key = ENV['RECAPTCHA_SECRET_KEY']
  
  # Skip verification in development if no keys are provided
  config.skip_verify_env = %w[development test] if Rails.env.development? && ENV['RECAPTCHA_SITE_KEY'].blank?
end
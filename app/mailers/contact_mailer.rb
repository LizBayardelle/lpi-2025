class ContactMailer < ApplicationMailer
  def new_message(message)
    @message = message
    mail(
      to: "elizabeth@linchpinindustries.com",
      subject: "New contact from #{message.name}: #{message.subject}"
    )
  end
end

class ProposalMailer < ApplicationMailer
  def new_request(proposal_request)
    @proposal = proposal_request
    mail(
      to: "elizabeth@linchpinindustries.com",
      subject: "New proposal request from #{proposal_request.name}"
    )
  end
end

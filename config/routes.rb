Rails.application.routes.draw do
  get "pages/about"
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Root route
  root "home#index"

  # Main navigation routes
  get "services", to: "services#index"
  get "work", to: "projects#index", as: :projects
  get "blog", to: "blog_posts#index", as: :blog
  get "about", to: "pages#about"
  get "contact", to: "contacts#new"

  # Service category pages
  get "strategy", to: "pages#strategy"
  get "digital", to: "pages#digital"
  get "content", to: "pages#content"
  get "marketing", to: "pages#marketing"
  get "design", to: "pages#design"

  # Legal pages
  get "privacy", to: "pages#privacy"
  get "terms", to: "pages#terms"

  # Resources for CRUD operations
  resources :services, only: [:index, :show]
  resources :projects, only: [:index, :show]
  resources :blog_posts, only: [:index, :show], path: "blog", as: :blogs
  resources :contacts, only: [:new, :create]
  resources :messages, only: [:create]
  resources :rfps, only: [:new, :create], path: "free-proposal"
  resources :subscribers, only: [:create]

  # Admin routes
  get "admin", to: "admin#index", as: :admin_dashboard
  namespace :admin do
    resources :projects, only: [:index, :show, :create, :update, :destroy]
    resources :messages, only: [:index, :show, :update, :destroy]
    resources :blog_posts, only: [:index, :show, :create, :update, :destroy]
  end
end

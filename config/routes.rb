Rails.application.routes.draw do
  root 'typing_games#index'
  get 'typing_games/problems/:language', to: 'typing_games#problems'
end
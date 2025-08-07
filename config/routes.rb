Rails.application.routes.draw do
  root 'typing_games#index'
  get 'typing_games', to: 'typing_games#index'
  # 将来的にスコア保存用
  # post 'typing_games/save_score', to: 'typing_games#save_score'
end
class TypingGamesController < ApplicationController
  def index
  end

  def problems
    language = params[:language] || 'html'
    
    case language
    when 'html'
      problems_data = load_json_file('html_problems.json')
    when 'css'
      problems_data = load_json_file('css_problems.json')
    else
      problems_data = { language => [] }
    end

    render json: problems_data
  end

  private

  def load_json_file(filename)
    file_path = Rails.root.join('app', 'data', filename)
    return {} unless File.exist?(file_path)
    
    JSON.parse(File.read(file_path))
  end
end
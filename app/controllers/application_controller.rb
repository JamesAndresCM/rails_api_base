class ApplicationController < ActionController::API
  include ExceptionHandler
  include Knock::Authenticable
  include CancanWarning
  rescue_from ActiveRecord::RecordNotFound, :with => :not_found
  
  # excepcion de ruta no encontrada
  def not_found(exception)
      render json: { status: "404", "#{exception.message}": "page not found"}
  end

  # excepcion de parametro requerido
  rescue_from ActionController::ParameterMissing do |exception|
    render json: { status: 422, "#{exception.param}":"is required"}
  end
end

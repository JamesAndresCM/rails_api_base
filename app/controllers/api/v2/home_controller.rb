class Api::V2::HomeController < Api::V1::HomeController
  def test
    render json: {status: 200, msg: "Test API V2"}
  end
end

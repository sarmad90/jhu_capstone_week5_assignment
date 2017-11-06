class AuthnController < ApplicationController
  before_action :authenticate_user!, only: [:checkme]

  def whoami
    if @user = current_user
      @roles = current_user.roles.application.pluck(:role_name, :mname)
      @user_image_url = image_url(@user.image_id) if @user.image_id
    end
  end

  def checkme
    render json: current_user || {}
  end
end

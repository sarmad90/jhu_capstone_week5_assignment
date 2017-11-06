class ImagePolicy < ApplicationPolicy
  def index?
    true
  end
  def show?
    true
  end
  def create?
    @user
  end
  def update?
    organizer?
  end
  def destroy?
    organizer_or_admin?
  end

  def get_things?
    true
  end

  class Scope < Scope
    def user_roles
      joins_clause = "left join Roles r on r.mname='Image' and r.mid=Images.id and r.user_id #{user_criteria}" +
          " left join Users u on u.image_id = Images.id"
      scope.select("Images.*, r.role_name")
           .joins(joins_clause)
           .where("u.image_id is null")
    end

    def resolve
      user_roles
    end
  end
end

class V1::UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :role, :avatar, :email, :slug
end

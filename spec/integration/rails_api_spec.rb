require 'swagger_helper' 

def authenticated_header(request, user)
  token = Knock::AuthToken.new(payload: { sub: user.id }).token
  request = "Authorization: "#{token}"
end

describe 'Rails Api Base' do
  path '/api/v1/sign_up' do
    post 'Register' do
    tags 'Register User'
    consumes 'application/json'
    parameter name: :user, in: :body, schema: {
    properties: {
      user: {
      type: :object,
      properties: {
          email: { type: :string },
          password: { type: :string },
          password_confirmation: { type: :string },
          username: { type: :string }
          }
        }
      }, required: [ 'email', 'password', 'password_confirmation', 'username' ]
    }

      response '200', 'user created' do
        let(:user) { 'valid' }
        run_test!
      end

      response '200', 'invalid request' do
        let(:user) { { username: 'fo' } }
        run_test!
      end
    end
  end

  path '/api/v1/sign_in' do
    post 'Auth' do
    tags 'Auth User'
    consumes 'application/json'
    parameter name: :user, in: :body, schema: {
    properties: {
      auth: {
      type: :object,
      properties: {
          email: { type: :string },
          password: { type: :string },
          }
        }
      }, required: [ 'email', 'password']
    }

      response '200', 'auth success' do
        let(:user) { { auth: { email: 'example_user@domain.com', password: '12345678' } } }
        run_test!
      end

      response '200', 'Invalid email address or password' do
        let(:user) { { auth: { email: 'fo' } } }
        run_test!
      end
    end
  end


  path '/api/v1/auth' do
    get 'Current User' do
    tags 'Current User'
    consumes 'application/json'
    parameter({
      :in => :header,
      :type => :string,
      :name => :Authorization,
      :required => true,
      :description => 'JWT token'
    })

      response '200', 'You are currently Logged-in username' do
        context 'with an authenticated user' do
            let(:user) { User.create(username: "test", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
            it 'renders json listing resource with id' do
              authenticated_header(request, user)
            end
        end
      end

      response '401', 'Error: Unauthorized' do
        context 'with an authenticated user' do
            let(:user) { User.create(username: "test", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
            it 'unauthorized' do
              authenticated_header(request, user)
          end
        end
      end
    end
  end

  path '/api/v1/admin/users' do
    get 'Only admin' do
    tags 'Get All Users'
    consumes 'application/json'
    parameter({
      :in => :header,
      :type => :string,
      :name => :Authorization,
      :required => true,
      :description => 'JWT token'
    })

      response '200', 'return all users' do
        context 'with an authenticated user' do
            let(:user) { User.create(username: "test", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
            it 'renders json listing resource with id' do
              authenticated_header(request, user)
            end
          end
      end

      response '401', 'Error: Unauthorized' do
        context 'with an authenticated user' do
            let(:user) { User.create(username: "te", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
            it 'render unauthorized' do
              authenticated_header(request, user)
            end
          end
      end
    end
  end


  path '/api/v1/users/{id}' do
    delete 'Delete user' do
      tags 'Delete User'
      produces 'application/json'
      parameter({
      :in => :header,
      :type => :string,
      :name => :Authorization,
      :required => true,
      :description => 'JWT token'
      })
      parameter name: :id, :in => :path, :type => :integer, :required => true

      response '200', 'User has been deleted' do
          context 'with an authenticated user' do
            let(:user) { User.create(username: "test", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
            it 'renders json listing resource with id' do
              authenticated_header(request, user)
            end
          end
        end

        response '422', "Couldn't find User with id" do
          context 'with an authenticated user' do
            let(:user) { User.create(username: "test", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
            it 'unauthorized' do
              authenticated_header(request, user)
            end
          end
        end
      end
    end


    path '/api/v1/users/{id}' do
    patch 'Update user' do
      tags 'Update User'
      produces 'application/json'
      parameter({
      :in => :header,
      :type => :string,
      :name => :Authorization,
      :required => true,
      :description => 'JWT token'
      })
      parameter name: :id, :in => :path, :type => :integer, :required => true
      parameter name: :current_password, :type => :string, :required => true

      parameter name: :user, in: :body, schema: {
        properties: {
        user: {
        type: :object,
        properties: {
          email: { type: :string },
          username: { type: :string },
          avatar: { type: :string },
          current_password: { type: :string },
          password: { type: :string },
          password_confirmation: { type: :string },
          }
        }
        }, required: [ 'token', 'id']
      }


      response '200', 'User has been updated' do
          context 'with an authenticated user' do
            let(:user) { User.create(username: "test", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
            it 'renders json listing resource with id' do
              authenticated_header(request, user)
            end
          end
        end

        response '404', "Couldn't find User with id" do
          context 'with an authenticated user' do
            let(:user) { User.create(username: "te", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
            it 'unauthorized' do
              authenticated_header(request, user)
            end
          end
        end
      end
    end

    path '/api/v1/users/{id}' do
    get 'Show user' do
      tags 'Show User'
      produces 'application/json'
      parameter({
      :in => :header,
      :type => :string,
      :name => :Authorization,
      :required => true,
      :description => 'JWT token'
      })
      parameter name: :id, :in => :path, :type => :integer, :required => true

      response '200', 'ok' do
        context 'with an authenticated user' do
          let(:user) { User.create(username: "test", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
          it 'renders json listing resource with id' do
            authenticated_header(request, user)
          end
        end
      end

        response '404', "Couldn't find User with id" do
          context 'with an authenticated user' do
              let(:user) { User.create(username: "te", email: "domain@domain.com", password: "12345678", password_confirmation: "12345678") }
                it 'unauthorized' do
                authenticated_header(request, user)
              end
            end
          end
        end
    end


  path '/api/v1/forgot_password' do
    post 'Forgot Password' do
    tags 'Forgot Password'
    consumes 'application/json'
    parameter name: :user, in: :body, schema: {
      type: :object,
      properties: {
        email: { type: :string },
        }, required: [ 'email']
      }

      response '200', 'An email has been sent to you with further instructions for reset your password' do
        let(:user) { { email: 'example@domain.com' } }
        run_test!
      end

      response '200', 'Email address not found. Please check and try again.' do
        let(:user) { { email: 'foo' } }
        run_test!
      end
    end
  end


  path '/api/v1/password_reset' do
    post 'Reset Password' do
    tags 'Reset Password'
    consumes 'application/json'
    parameter name: :user, in: :body, schema: {
    properties: {
      user: {
      type: :object,
      properties: {
          token: { type: :string },
          password: { type: :string },
          password_confirmation: { type: :string },
          }
        }
      }, required: [ 'token', 'password', 'password_confirmation' ]
    }

      response '200', 'Password has been changed' do
        let(:user) { { token: 'swjiosiowncxi3290390', password: '12345678', password_confirmation: '12345678' } }
        run_test!
      end

      response '200', 'Link not valid or expired. Try generating a new link.' do
        let(:user) { { token: '' } }
        run_test!
      end
    end
  end
end

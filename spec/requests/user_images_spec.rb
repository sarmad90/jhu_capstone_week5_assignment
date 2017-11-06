require 'rails_helper'

RSpec.describe 'UserImages', type: :request do
  include_context 'db_cleanup_each'
  let(:user_image) { FactoryGirl.create(:image) }
  let(:account) { signup(FactoryGirl.attributes_for(:user)) }
  let!(:other_images) { (1..5).map { |_| FactoryGirl.create(:image) } }
  let(:image_props) { FactoryGirl.attributes_for(:image, user_id: account[:id]) }

  before(:each) {
    user = User.find(account[:id])
    user.image_id = user_image['id']
    user.save
    login account
  }

  it 'assigns an image to a user' do
    jpost images_url, image_props
    expect(response).to have_http_status(:created)
    image = Image.find(parsed_body['id'])
    user = User.find(account[:id])
    expect(image.user).to eq(user)
    expect(user.image).to eq(image)
  end

  it 'does not return user images among all images' do
    jget send('images_path'), {}, Accept: 'application/json'
    expect(response).to have_http_status(:ok)
    expect(response.content_type).to eq('application/json')

    expect(parsed_body.count).to eq(other_images.count)
  end

  it 'gets user image through whoami' do
    jget authn_whoami_path
    #pp parsed_body
    expect(response).to have_http_status(:ok)
    payload = parsed_body
    expect(payload).not_to include('image_id')
    expect(payload).not_to include('image')
    expect(payload).to include('user_image_url' => image_url(user_image[:id]))
  end
end

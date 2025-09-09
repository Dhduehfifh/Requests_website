//我的/Edit Profile/
//TODO:头像url换成赋值，testarea链接curd api，用户兴趣爱好添加一个array 
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Calendar, GraduationCap, Edit3, Save, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface EditProfileScreenProps {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '张三',
    username: 'zhangsan',
    bio: '国际学生，热爱生活，喜欢探索新事物',
    email: 'zhangsan@example.com',
    phone: '+1 (555) 123-4567',
    city: '多伦多',
    school: '多伦多大学',
    major: '计算机科学',
    birthday: '1995-03-15',
    year: '研究生二年级',
    interests: ['编程', '摄影', '旅行', '美食']
  });

  const [tempData, setTempData] = useState(profileData);

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestAdd = (interest: string) => {
    if (interest && !tempData.interests.includes(interest)) {
      setTempData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleInterestRemove = (interest: string) => {
    setTempData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const profileSections = [
    {
      title: '基本信息',
      icon: User,
      fields: [
        {
          label: '姓名',
          key: 'name',
          type: 'text',
          placeholder: '请输入你的姓名'
        },
        {
          label: '用户名',
          key: 'username',
          type: 'text',
          placeholder: '请输入用户名'
        },
        {
          label: '个人简介',
          key: 'bio',
          type: 'textarea',
          placeholder: '介绍一下自己吧...'
        }
      ]
    },
    {
      title: '联系方式',
      icon: Mail,
      fields: [
        {
          label: '邮箱地址',
          key: 'email',
          type: 'email',
          placeholder: '请输入邮箱地址'
        },
        {
          label: '手机号码',
          key: 'phone',
          type: 'tel',
          placeholder: '请输入手机号码'
        }
      ]
    },
    {
      title: '个人信息',
      icon: MapPin,
      fields: [
        {
          label: '所在城市',
          key: 'city',
          type: 'text',
          placeholder: '请输入所在城市'
        },
        {
          label: '学校',
          key: 'school',
          type: 'text',
          placeholder: '请输入学校名称'
        },
        {
          label: '专业',
          key: 'major',
          type: 'text',
          placeholder: '请输入专业'
        },
        {
          label: '年级',
          key: 'year',
          type: 'text',
          placeholder: '请输入年级'
        },
        {
          label: '生日',
          key: 'birthday',
          type: 'date',
          placeholder: '请选择生日'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">✏️ 編輯個人資料</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* 头像设置 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Camera className="w-5 h-5 text-yellow-600 mr-2" />
              头像设置
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">🧀</span>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">当前头像</div>
                    <div className="text-sm text-gray-500 mt-1">点击相机图标更换头像</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      选择照片
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 个人资料表单 */}
          {profileSections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <div key={sectionIndex}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <IconComponent className="w-5 h-5 text-yellow-600 mr-2" />
                  {section.title}
                </h2>
                <Card className="bg-white border border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="p-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={isEditing ? tempData[field.key as keyof typeof tempData] : profileData[field.key as keyof typeof profileData]}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                              rows={3}
                            />
                          ) : (
                            <input
                              type={field.type}
                              value={isEditing ? tempData[field.key as keyof typeof tempData] : profileData[field.key as keyof typeof profileData]}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}

          {/* 兴趣爱好 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Edit3 className="w-5 h-5 text-yellow-600 mr-2" />
              兴趣爱好
            </h2>
            <Card className="bg-white border border-gray-200">
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? tempData.interests : profileData.interests).map((interest, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{interest}</span>
                        {isEditing && (
                          <button
                            onClick={() => handleInterestRemove(interest)}
                            className="ml-1 hover:bg-yellow-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="添加新的兴趣爱好..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleInterestAdd(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button size="sm">添加</Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                编辑资料
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  取消
                </Button>
                <Button 
                  onClick={handleSave}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </>
            )}
          </div>

          {/* 隐私提示 */}
          <div>
            <Card className="bg-blue-50 border border-blue-200">
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">隐私提示</div>
                    <div className="text-sm text-blue-700 mt-1">
                      你的个人信息将根据你的隐私设置显示给其他用户。
                      你可以在"隐私与安全"设置中控制哪些信息是公开的。
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

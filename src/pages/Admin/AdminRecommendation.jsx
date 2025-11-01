import { useState, useEffect } from 'react';
import { Card, Button, Statistic, Row, Col, Alert, Tag, Spin, Modal, message, Progress } from 'antd';
import {
  RobotOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  DatabaseOutlined,
  UserOutlined,
  BookOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import {
  getModelInfo,
  getHealthStatus,
  triggerRetrain
} from '../../services/recommendationService';
import AdminLayout from '../../layout/AdminLayout';

const AdminRecommendation = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Load model info
  const loadModelInfo = async () => {
    try {
      const [info, health] = await Promise.all([
        getModelInfo(),
        getHealthStatus()
      ]);
      setModelInfo(info);
      setHealthStatus(health);
    } catch (error) {
      console.error('Failed to load model info:', error);
      message.error('Không thể tải thông tin model');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadModelInfo();
  }, []);

  // Auto refresh when retraining
  useEffect(() => {
    let interval;
    if (autoRefresh || healthStatus?.status === 'retraining') {
      interval = setInterval(loadModelInfo, 3000); // Refresh every 3s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, healthStatus?.status]);

  // Handle retrain
  const handleRetrain = () => {
    Modal.confirm({
      title: 'Xác nhận retrain model',
      icon: <WarningOutlined />,
      content: (
        <div>
          <p>Bạn có chắc muốn retrain lại model?</p>
          <p>Quá trình này sẽ:</p>
          <ul>
            <li>Tải lại toàn bộ dữ liệu từ database</li>
            <li>Huấn luyện lại Collaborative Filtering model</li>
            <li>Huấn luyện lại Content-Based model</li>
            <li>Thay thế model hiện tại bằng model mới</li>
          </ul>
          <p><strong>Thời gian ước tính: 2-5 phút</strong></p>
        </div>
      ),
      okText: 'Retrain',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setRetraining(true);
          await triggerRetrain();
          message.success('Đã bắt đầu retrain model! Theo dõi tiến trình bên dưới.');
          setAutoRefresh(true);
          
          // Auto stop refresh after 10 minutes
          setTimeout(() => {
            setAutoRefresh(false);
          }, 600000);
        } catch (error) {
          console.error('Failed to trigger retrain:', error);
          message.error(error.response?.data?.detail || 'Không thể trigger retrain');
        } finally {
          setRetraining(false);
        }
      }
    });
  };

  // Render status tag
  const renderStatusTag = () => {
    if (!healthStatus) return null;

    const statusConfig = {
      ok: { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoạt động bình thường' },
      retraining: { color: 'processing', icon: <SyncOutlined spin />, text: 'Đang retrain...' },
      error: { color: 'error', icon: <WarningOutlined />, text: 'Lỗi' }
    };

    const config = statusConfig[healthStatus.status] || statusConfig.error;

    return (
      <Tag icon={config.icon} color={config.color} style={{ fontSize: 14, padding: '4px 12px' }}>
        {config.text}
      </Tag>
    );
  };

  if (loading) {
    return (
      <AdminLayout title="Hệ thống gợi ý">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#666' }}>Đang tải thông tin model...</p>
        </div>
      </AdminLayout>
    );
  }

  const isRetraining = healthStatus?.status === 'retraining';
  const modelsLoaded = healthStatus?.models_loaded;

  return (
    <AdminLayout title="Hệ thống gợi ý">
      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24, gap: 8 }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadModelInfo}
        >
          Làm mới
        </Button>
        
        <Button
          type="primary"
          danger
          icon={<SyncOutlined />}
          onClick={handleRetrain}
          loading={retraining}
          disabled={isRetraining || !modelsLoaded}
        >
          {isRetraining ? 'Đang retrain...' : 'Retrain Model'}
        </Button>
      </div>

      {/* Status Tag */}
      <div style={{ marginBottom: 16 }}>
        {renderStatusTag()}
      </div>

      {/* Alert for retraining */}
      {isRetraining && (
        <Alert
          message="Model đang được retrain"
          description={
            <div>
              <p>Hệ thống đang huấn luyện lại model với dữ liệu mới nhất. Vui lòng đợi...</p>
              <Progress percent={undefined} status="active" />
              <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                Trang này sẽ tự động cập nhật mỗi 3 giây
              </p>
            </div>
          }
          type="info"
          showIcon
          icon={<SyncOutlined spin />}
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Alert for model not loaded */}
      {!modelsLoaded && !isRetraining && (
        <Alert
          message="Model chưa được load"
          description="Hệ thống chưa có model. Vui lòng retrain để tạo model mới."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Model Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hybrid Alpha"
              value={modelInfo?.alpha || 0}
              precision={2}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Tỷ lệ kết hợp CF & Content
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Status"
              value={modelsLoaded ? 'Loaded' : 'Not Loaded'}
              prefix={modelsLoaded ? <CheckCircleOutlined /> : <WarningOutlined />}
              valueStyle={{ color: modelsLoaded ? '#52c41a' : '#ff4d4f' }}
            />
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Trạng thái model
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="CF Users"
              value={modelInfo?.cf_model?.num_users || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Số user trong CF model
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Content Books"
              value={modelInfo?.content_model?.num_books || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Số sách trong Content model
            </div>
          </Card>
        </Col>
      </Row>

      {/* Detailed Info */}
      <Row gutter={[16, 16]}>
        {/* Collaborative Filtering Model */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <UserOutlined style={{ marginRight: 8 }} />
                Collaborative Filtering Model
              </span>
            }
            extra={
              modelInfo?.cf_model ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="default">Not Loaded</Tag>
              )
            }
          >
            {modelInfo?.cf_model ? (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        Number of Users
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {modelInfo.cf_model.num_users.toLocaleString()}
                      </div>
                    </div>
                  </Col>
                  
                  <Col span={12}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        Number of Items
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {modelInfo.cf_model.num_items.toLocaleString()}
                      </div>
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        Matrix Non-Zero Elements
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {modelInfo.cf_model.matrix_nnz.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                        Density: {(
                          (modelInfo.cf_model.matrix_nnz / 
                          (modelInfo.cf_model.num_users * modelInfo.cf_model.num_items)) * 100
                        ).toFixed(4)}%
                      </div>
                    </div>
                  </Col>
                </Row>

                <div style={{ 
                  marginTop: 16, 
                  padding: 12, 
                  background: '#f5f5f5', 
                  borderRadius: 4 
                }}>
                  <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <span style={{ fontSize: 12, color: '#666' }}>
                    Model dựa trên tương tác giữa user và sách (favorites, ratings, history)
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <DatabaseOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>Model chưa được load</p>
              </div>
            )}
          </Card>
        </Col>

        {/* Content-Based Model */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <BookOutlined style={{ marginRight: 8 }} />
                Content-Based Model
              </span>
            }
            extra={
              modelInfo?.content_model ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="default">Not Loaded</Tag>
              )
            }
          >
            {modelInfo?.content_model ? (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        Number of Books
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {modelInfo.content_model.num_books.toLocaleString()}
                      </div>
                    </div>
                  </Col>
                  
                  <Col span={12}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        Feature Dimension
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {modelInfo.content_model.feature_dim.toLocaleString()}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div style={{ 
                  marginTop: 16, 
                  padding: 12, 
                  background: '#f5f5f5', 
                  borderRadius: 4 
                }}>
                  <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <span style={{ fontSize: 12, color: '#666' }}>
                    Model dựa trên nội dung sách (title, author, genres, description)
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <DatabaseOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>Model chưa được load</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Instructions */}
      <Card
        title="Hướng dẫn sử dụng"
        style={{ marginTop: 16 }}
      >
        <div style={{ fontSize: 14, lineHeight: 1.8 }}>
          <h4>📊 Khi nào cần Retrain Model?</h4>
          <ul>
            <li>Khi có nhiều user mới đăng ký</li>
            <li>Khi thêm nhiều sách mới vào hệ thống</li>
            <li>Khi có nhiều tương tác mới (favorites, ratings, reading history)</li>
            <li>Định kỳ mỗi tuần/tháng để cập nhật xu hướng</li>
          </ul>

          <h4>⚙️ Quy trình Retrain:</h4>
          <ol>
            <li>Click nút <strong>"Retrain Model"</strong></li>
            <li>Xác nhận retrain trong popup</li>
            <li>Hệ thống sẽ tự động:
              <ul>
                <li>Tải dữ liệu mới nhất từ database</li>
                <li>Huấn luyện Collaborative Filtering model</li>
                <li>Huấn luyện Content-Based model</li>
                <li>Thay thế model cũ bằng model mới (hot-swap)</li>
              </ul>
            </li>
            <li>Theo dõi tiến trình trên trang này (tự động refresh)</li>
          </ol>

          <h4>⚡ Lưu ý:</h4>
          <ul>
            <li>Quá trình retrain diễn ra trong background, không ảnh hưởng API</li>
            <li>Model cũ vẫn hoạt động trong lúc retrain</li>
            <li>Chỉ khi retrain thành công, model mới mới được áp dụng</li>
            <li>Thời gian retrain phụ thuộc vào lượng dữ liệu (thường 2-5 phút)</li>
          </ul>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminRecommendation;

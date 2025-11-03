import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Statistic, Row, Col, Alert, Tag, Spin, Modal, message, Progress, Switch, InputNumber, Descriptions, Tabs } from 'antd';
import {
  ReloadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  DatabaseOutlined,
  UserOutlined,
  BookOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import {
  getModelInfo,
  getHealthStatus,
  triggerRetrain,
  getOnlineLearningStatus,
  enableOnlineLearning,
  disableOnlineLearning,
  triggerIncrementalUpdate
} from '../../services/recommendationService';
import AdminLayout from '../../layout/AdminLayout';

const { TabPane } = Tabs;

const AdminRecommendation = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [onlineLearningStatus, setOnlineLearningStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [bufferSize, setBufferSize] = useState(100);
  const [updatingBuffer, setUpdatingBuffer] = useState(false);

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      const [info, health, olStatus] = await Promise.all([
        getModelInfo(),
        getHealthStatus(),
        getOnlineLearningStatus()
      ]);
      setModelInfo(info);
      setHealthStatus(health);
      setOnlineLearningStatus(olStatus);
    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('Không thể tải thông tin hệ thống');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Auto refresh when retraining
  useEffect(() => {
    let interval;
    
    // Check if currently retraining based on backend status
    const isCurrentlyRetraining = modelInfo?.is_retraining === true;
    
    if (isCurrentlyRetraining) {
      // Start auto-refresh during retrain
      console.log('🔄 Starting auto-refresh (retrain in progress)...');
      interval = setInterval(loadAllData, 3000);
    } else {
      // Not retraining, ensure no interval
      console.log('✅ Retrain completed or not in progress, no auto-refresh');
    }
    
    return () => {
      if (interval) {
        console.log('🛑 Clearing auto-refresh interval');
        clearInterval(interval);
      }
    };
  }, [modelInfo?.is_retraining, loadAllData]);

  // Handle retrain
  const handleRetrain = () => {
    Modal.confirm({
      title: 'Xác nhận retrain toàn bộ model',
      icon: <WarningOutlined />,
      content: (
        <div>
          <p>Bạn có chắc muốn retrain lại toàn bộ model?</p>
          <p>Quá trình này sẽ:</p>
          <ul>
            <li>Tải lại toàn bộ dữ liệu từ database</li>
            <li>Huấn luyện lại Implicit ALS model (Collaborative Filtering)</li>
            <li>Huấn luyện lại SBERT model (Content-Based)</li>
            <li>Tạo lại user profiles cho SBERT</li>
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
          
          // Force reload to get updated is_retraining status
          await loadAllData();
        } catch (error) {
          console.error('Failed to trigger retrain:', error);
          message.error(error.response?.data?.detail || 'Không thể trigger retrain');
        } finally {
          setRetraining(false);
        }
      }
    });
  };

  // Handle Online Learning toggle
  const handleOnlineLearningToggle = async (enabled) => {
    try {
      if (enabled) {
        const result = await enableOnlineLearning(bufferSize);
        message.success(`Đã bật Online Learning với buffer size = ${result.buffer_size}`);
      } else {
        await disableOnlineLearning();
        message.success('Đã tắt Online Learning');
      }
      await loadAllData();
    } catch (error) {
      console.error('Failed to toggle online learning:', error);
      message.error('Không thể thay đổi trạng thái Online Learning');
    }
  };

  // Handle apply buffer size
  const handleApplyBufferSize = async () => {
    try {
      if (bufferSize < 10 || bufferSize > 1000) {
        message.error('Buffer size phải nằm trong khoảng 10-1000');
        return;
      }
      
      // Disable first, then enable with new buffer size
      await disableOnlineLearning();
      const result = await enableOnlineLearning(bufferSize);
      message.success(`Đã cập nhật buffer size = ${result.buffer_size}`);
      await loadAllData();
    } catch (error) {
      console.error('Failed to update buffer size:', error);
      message.error('Không thể cập nhật buffer size');
    }
  };

  // Handle incremental update
  const handleIncrementalUpdate = async (force = false) => {
    try {
      setUpdatingBuffer(true);
      const result = await triggerIncrementalUpdate(force);
      
      if (result.status === 'updated') {
        message.success(`Đã cập nhật SBERT user profiles! (${result.interactions_processed} tương tác)`);
      } else {
        message.info(result.message || 'Không có cập nhật nào được thực hiện');
      }
      
      await loadAllData();
    } catch (error) {
      console.error('Failed to trigger incremental update:', error);
      message.error(error.response?.data?.detail || 'Không thể trigger update');
    } finally {
      setUpdatingBuffer(false);
    }
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

  const isRetraining = modelInfo?.is_retraining || healthStatus?.status === 'retraining';
  const modelsLoaded = healthStatus?.models_loaded;
  const bufferProgress = onlineLearningStatus?.enabled 
    ? (onlineLearningStatus.buffer_size / onlineLearningStatus.buffer_capacity * 100) 
    : 0;

  return (
    <AdminLayout title="Hệ thống gợi ý">
      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>{renderStatusTag()}</div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadAllData}
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
            {isRetraining ? 'Đang retrain...' : 'Retrain Toàn Bộ'}
          </Button>
        </div>
      </div>

      {/* Alert for retraining */}
      {isRetraining && (
        <Alert
          message="Model đang được retrain"
          description={
            <div>
              <p>Hệ thống đang huấn luyện lại toàn bộ model với dữ liệu mới nhất...</p>
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

      {/* Tabs */}
      <Tabs defaultActiveKey="overview" type="card">
        {/* Overview Tab */}
        <TabPane tab="Tổng quan" key="overview">
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
                  ALS: {((modelInfo?.alpha || 0) * 100).toFixed(0)}% | SBERT: {((1 - (modelInfo?.alpha || 0)) * 100).toFixed(0)}%
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="ALS Users"
                  value={modelInfo?.cf_model?.num_users || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
                <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                  Collaborative Filtering
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="SBERT Books"
                  value={modelInfo?.content_model?.num_books || 0}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
                <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                  Content-Based
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="User Profiles"
                  value={modelInfo?.content_model?.num_user_profiles || 0}
                  prefix={<ThunderboltOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
                <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                  SBERT Profiles (Online Learning)
                </div>
              </Card>
            </Col>
          </Row>

          {/* Detailed Model Info */}
          <Row gutter={[16, 16]}>
            {/* Implicit ALS Model */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Implicit ALS Model
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
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Users">
                      {modelInfo.cf_model.num_users.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Items">
                      {modelInfo.cf_model.num_items.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Factors">
                      {modelInfo.cf_model.factors}
                    </Descriptions.Item>
                    <Descriptions.Item label="Iterations">
                      {modelInfo.cf_model.iterations}
                    </Descriptions.Item>
                    <Descriptions.Item label="Regularization">
                      {modelInfo.cf_model.regularization}
                    </Descriptions.Item>
                    <Descriptions.Item label="Matrix NNZ">
                      {modelInfo.cf_model.matrix_nnz.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Density">
                      {(
                        (modelInfo.cf_model.matrix_nnz /
                        (modelInfo.cf_model.num_users * modelInfo.cf_model.num_items)) * 100
                      ).toFixed(4)}%
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <DatabaseOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <p>Model chưa được load</p>
                  </div>
                )}
              </Card>
            </Col>

            {/* SBERT Model */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <BookOutlined style={{ marginRight: 8 }} />
                    SBERT Model
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
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Model Name">
                      {modelInfo.content_model.model_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Books">
                      {modelInfo.content_model.num_books.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="User Profiles">
                      {modelInfo.content_model.num_user_profiles.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Embedding Dim">
                      {modelInfo.content_model.embedding_dim || 'N/A'}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <DatabaseOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <p>Model chưa được load</p>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Online Learning Tab */}
        <TabPane 
          tab={
            <span>
              <ThunderboltOutlined />
              Online Learning
            </span>
          } 
          key="online-learning"
        >
          <Alert
            message="Lưu ý về Online Learning"
            description={
              <div>
                <p><strong>Online Learning chỉ cập nhật SBERT user profiles</strong>, không cập nhật ALS model.</p>
                <p>Để cập nhật ALS model, bạn cần thực hiện <strong>Retrain Toàn Bộ</strong>.</p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={[16, 16]}>
            {/* Online Learning Control */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <SettingOutlined style={{ marginRight: 8 }} />
                    Điều khiển Online Learning
                  </span>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Trạng thái:</span>
                    <Switch
                      checked={onlineLearningStatus?.enabled}
                      onChange={handleOnlineLearningToggle}
                      checkedChildren="Bật"
                      unCheckedChildren="Tắt"
                    />
                  </div>

                  {onlineLearningStatus?.enabled && (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                          Buffer Progress: {onlineLearningStatus.buffer_size} / {onlineLearningStatus.buffer_capacity}
                        </div>
                        <Progress
                          percent={bufferProgress}
                          status={onlineLearningStatus.buffer_full ? 'exception' : 'active'}
                          strokeColor={onlineLearningStatus.buffer_full ? '#ff4d4f' : '#1890ff'}
                        />
                        {onlineLearningStatus.buffer_full && (
                          <div style={{ fontSize: 12, color: '#ff4d4f', marginTop: 4 }}>
                            ⚠️ Buffer đã đầy! Nên trigger update ngay.
                          </div>
                        )}
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          onClick={() => handleIncrementalUpdate(false)}
                          loading={updatingBuffer}
                          disabled={!onlineLearningStatus.buffer_full}
                          block
                        >
                          Trigger Update (khi buffer đầy)
                        </Button>
                      </div>

                      <div>
                        <Button
                          type="default"
                          danger
                          icon={<ThunderboltOutlined />}
                          onClick={() => handleIncrementalUpdate(true)}
                          loading={updatingBuffer}
                          block
                        >
                          Force Update Now (bất kể buffer)
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </Col>

            {/* Buffer Configuration */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <DatabaseOutlined style={{ marginRight: 8 }} />
                    Cấu hình Buffer
                  </span>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    Buffer Size (10-1000)
                  </div>
                  <InputNumber
                    value={bufferSize}
                    onChange={setBufferSize}
                    min={10}
                    max={1000}
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    Số lượng tương tác tích lũy trước khi trigger update tự động
                  </div>
                </div>

                <Button
                  type="primary"
                  onClick={handleApplyBufferSize}
                  disabled={!onlineLearningStatus?.enabled}
                  block
                >
                  Áp dụng Buffer Size
                </Button>

                {onlineLearningStatus?.note && (
                  <Alert
                    message={onlineLearningStatus.note}
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* Online Learning Info */}
          <Card
            title="Về Online Learning"
            style={{ marginTop: 16 }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              <h4>🚀 Online Learning là gì?</h4>
              <p>
                Online Learning cho phép hệ thống cập nhật <strong>SBERT user profiles</strong> một cách 
                incremental (từng phần) mà không cần retrain toàn bộ model. Điều này giúp:
              </p>
              <ul>
                <li>Cập nhật nhanh theo tương tác người dùng mới</li>
                <li>Tiết kiệm thời gian (không cần retrain toàn bộ)</li>
                <li>Cải thiện recommendations theo thời gian thực</li>
              </ul>

              <h4>📊 Cách hoạt động:</h4>
              <ol>
                <li>Hệ thống thu thập tương tác người dùng vào <strong>buffer</strong></li>
                <li>Khi buffer đầy (đạt buffer_size), tự động trigger update</li>
                <li>Hoặc bạn có thể <strong>Force Update</strong> bất kỳ lúc nào</li>
                <li>Chỉ SBERT user profiles được cập nhật, ALS model giữ nguyên</li>
              </ol>

              <h4>⚠️ Hạn chế:</h4>
              <ul>
                <li>Chỉ cập nhật SBERT, không cập nhật ALS model</li>
                <li>Để cập nhật ALS, cần Retrain Toàn Bộ</li>
                <li>Buffer size nên chọn phù hợp với lượng tương tác (10-1000)</li>
              </ul>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminRecommendation;

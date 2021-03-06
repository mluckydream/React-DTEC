import React, { ReactPropTypes } from 'react';
import NavBar from './components/nav-bar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BackTop from '../../components/BackTop';
import AsideItem from '../../components/AsideItem';
import { Carousel, message } from 'antd';
import { Link } from 'react-router-dom';
import { IState } from './data';
import { isPhone, checkRegisterPassword } from './utils';
import { getBannerList } from '../../services/service';
import { getCategoryList } from '../../services/category/service';
import { getArticleList, getArticleListOfType } from '../../services/article/service';
import { login, logout, register, getPersonalData } from '../../services/user/service';
import { LoginParamsType } from '../../services/user/data';
import './style.less';
import { ArticleType, BannerType } from '../data';
import { GetArticleListParamsType } from '../../services/article/data';


const BASE_URL = "http://127.0.0.1";

class HomePage extends React.Component<ReactPropTypes, IState> {
  // 获取文章列表请求参数
  private articleListParams: GetArticleListParamsType = {
    page: 1,
    category: 0,
    keyword: '',
  };

  state = {
    // 表单数据
    registerWindowFlag: false,
    isLogin: false,
    hasNextPage: true,
    lphone: '',
    lpasswd: '',
    rphone: '',
    rpasswd: '',
    rcpasswd: '',
    // 获取的数据
    categoryList: [],
    bannerList: [],
    articleList: [],
    articleHotList: [],
    articlePopularList: [],
    userData: {
      username: '',
      _id: '',
      avatar: '',
      motto: '',
      admin: false,
    },
  }
  /**
   * 初始加载文章分类列表、文章列表、用户信息
   */
  componentDidMount(): void {
    this.getPersonalData();
    this.getArticleList();

    getCategoryList().then((res: any) => {
      res.data.unshift({ typeName: '全部', _id: '0' });
      this.setState({ categoryList: res.data });
    });

    getBannerList().then((res: any) => {
      this.setState({ bannerList: res.data });
    });

    getArticleListOfType('hot').then((res: any) => {
      this.setState({ articleHotList: res.data });
    });

    getArticleListOfType('popular').then((res: any) => {
      this.setState({ articlePopularList: res.data });
    });
  }

  /**
   * 获取用户信息
   */
  getPersonalData = (): void => {
    getPersonalData().then((res: any) => {
      if (res.state !== 302) {
        this.setState({ isLogin: true, userData: res.data });
      }
    })
  }

  /**
   * 获取文章列表
   */
  getArticleList = (): void => {
    getArticleList(this.articleListParams).then((res: any) => {
      if (res.data.length < 10) {
        this.setState({ hasNextPage: false })
      }
      this.setState({ articleList: res.data });
    })
  }

  /**
   * 搜索文章
   */
  onSearchArticle = (keyword: string): void => {
    this.articleListParams.keyword = keyword;
    this.articleListParams.page = 1;
    this.getArticleList();
  }
  /**
   * 筛选分类文章
   */
  onScreenArticle = (value: string) => {
    this.articleListParams.category = value;
    this.articleListParams.page = 1;
    this.getArticleList();
  }
  /**
   * 加载更多
   */
  onLoadMore = (): void => {
    this.articleListParams.page++;
    let articleList: ArticleType[] = this.state.articleList;
    getArticleList(this.articleListParams).then((res: any) => {
      articleList.push(...res.data)
      this.setState({ articleList });
      if (res.data.length <= 10) {
        this.setState({ hasNextPage: false })
      }
    })
  }

  /**
   * 打开登录弹窗
   */
  onShowRegisterWindow = (): void => {
    this.setState({ registerWindowFlag: true });
  }
  /**
   * 关闭登录弹窗
   */
  onHideRegisterWindow = (): void => {
    this.setState({ registerWindowFlag: false });
  }

  /**
   * 手机号、密码数据双向绑定
   */
  onBindLphone = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ lphone: e.target.value });
  }
  onBindLpasswd = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ lpasswd: e.target.value });
  }
  onBindRphone = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ rphone: e.target.value });
  }
  onBindRpasswd = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ rpasswd: e.target.value });
  }
  onBindRcpasswd = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ rcpasswd: e.target.value });
  }

  /**
   * 登录
   */
  onLogin = (): void => {
    const { lphone, lpasswd } = this.state;
    const params: LoginParamsType = { tel: lphone, password: lpasswd };
    if (lphone !== '') {
      if (isPhone(lphone)) {
        if (lpasswd !== '') {
          message.loading('登录中', 2, () => {
            login(params).then((res: any) => {
              if (res.state === 0) {
                message.success('登录成功！', 1);
                this.getPersonalData();
              } else {
                message.error(res.msg);
              }
            });
          })
        } else {
          message.error('请输入密码！');
        }
      } else {
        message.error('手机号格式不正确！');
      }
    } else {
      message.error('请输入手机号');
    }
  }

  /**
   * 注册
   */
  onRegister = (): void => {
    const { rphone, rpasswd, rcpasswd } = this.state;
    const params: LoginParamsType = { tel: rphone, password: rpasswd };

    if (isPhone(rphone)) {
      switch (checkRegisterPassword(rpasswd, rcpasswd)) {
        case 0:
          register(params).then((res: any) => {
            if (res.state === 0) {
              message.success('注册成功，快去登录吧！', 2);
              this.setState({ registerWindowFlag: false });
            } else {
              message.error(res.msg);
            }
          });
          break;
        case 1:
          message.error('密码不能为空！');
          break;
        case 2:
          message.error('两次输入的密码不一致，请重新输入！');
          break;
      }
    } else {
      message.error('手机号格式不正确！');
    }
  }

  /**
   * 退出登录
   */
  onLogout = (): void => {
    logout().then((res: any) => {
      if (res.state === 0) {
        this.setState({ isLogin: false });
      }
    })
  }

  render() {
    const { userData, bannerList } = this.state;

    return (
      <main className="main">
        <Header />
        <NavBar
          category={this.state.categoryList}
          onSearch={this.onSearchArticle}
          onScreen={this.onScreenArticle}
        />
        <section className="banner">
          <div className="container">
            <Carousel autoplay>
              {
                bannerList.map((item: BannerType) => (
                  <div key={item._id}>
                    <img src={`${BASE_URL}${item.path}`} alt={item.name} />
                  </div>
                ))
              }
            </Carousel>
          </div>
        </section>
        <section className="main">
          <div className="container content">
            {/* 文章列表 */}
            <div className="article-list">
              {this.state.articleList.map((item: ArticleType) => (
                <div className="article-item" key={item._id}>
                  <h2>{item.title}</h2>
                  <span>发布于 {item.date}</span>
                  <p className="multiple-ellipsis">{item.des}</p>
                  <Link to={`/article/${item._id}`}>continune reading</Link>
                </div>
              ))}
              {this.state.hasNextPage ?
                <button className="load-more" onClick={this.onLoadMore}>加载更多</button> :
                <button className="load-more">已经到底啦！</button>}
            </div>
            {/* 侧边栏 */}
            <aside className="hot-list">
              {
                this.state.isLogin ?
                  <section className="user">
                    <div className="title">个人信息</div>
                    <div className="base-data clearfix">
                      <div className="avatar">
                        <img src={`${BASE_URL}${userData.avatar}`} alt="" />
                      </div>
                      <div className="info">
                        <Link to={`/user/${userData._id}`}>{userData.username}</Link>
                        <p className="alone-ellipsis">{userData.motto || '一句话介绍自己'}</p>
                      </div>
                    </div>
                    <div className="action-panel">
                      <div className="action-item"><Link to={`/post/${userData._id}`}>写文章</Link></div>
                      <div className="action-item"><Link to={`/user/${userData._id}`}>我的主页</Link></div>
                      <div className="action-item" onClick={this.onLogout}>退出</div>
                    </div>
                    {
                      userData.admin &&
                      <div className="backstage"><Link to={`/admin`}>进入后台</Link></div>
                    }
                  </section> :
                  <section className="login">
                    <div className="title">
                      用户登录<span onClick={this.onShowRegisterWindow}>注册</span>
                    </div>
                    <div className="login-box">
                      <input type="text" placeholder="手机号" onChange={this.onBindLphone} value={this.state.lphone} />
                      <input type="password" placeholder="密码" onChange={this.onBindLpasswd} value={this.state.lpasswd} />
                      <button onClick={this.onLogin}>登录</button>
                    </div>
                  </section>
              }
              <AsideItem title="阅读榜" list={this.state.articleHotList} />
              <AsideItem title="点赞榜" list={this.state.articlePopularList} />
            </aside>
          </div>
        </section>
        <Footer />
        <BackTop />
        {/* 注册窗口 */}
        {
          this.state.registerWindowFlag ?
            <div className="register">
              <div className="mask">
                <div className="register-box">
                  <div className="title">
                    注册社区账号<span onClick={this.onHideRegisterWindow}>×</span>
                  </div>
                  <div className="register-content">
                    <h1>DTEC</h1>
                    <input type="text" placeholder="手机号" onChange={this.onBindRphone} value={this.state.rphone} />
                    <input type="password" placeholder="密码" onChange={this.onBindRpasswd} value={this.state.rpasswd} />
                    <input type="password" placeholder="确认密码" onChange={this.onBindRcpasswd} value={this.state.rcpasswd} />
                    <button onClick={this.onRegister}>注册</button>
                  </div>
                </div>
              </div>
            </div> :
            null
        }
      </main>
    )
  }
};

export default HomePage;
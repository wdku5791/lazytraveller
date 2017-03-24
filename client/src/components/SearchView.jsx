import React from 'react';
import SearchBar from './SearchBar.jsx'
import FilterList from './FilterList.jsx'

export default class SearchView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      filters: props.filters,
      budget: '',
      duration: '',
      startLocation: '',
      endLocation: ''
    }

    this.submitHandler = this.submitHandler.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateLimits = this.updateLimits.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filters: nextProps.filters
    });
  }

  submitHandler(query) {
    let filters = [];
    this.state.filters.forEach(filter => {
      if (filter.checked) {
        filters.push(filter._id);
      }
    })

    let limits = {
      budget: this.state.budget,
      duration: this.state.duration,
      location: {
        start: this.state.startLocation,
        end: this.state.endLocation
      }
    }

    this.props.sendHandler(this.state.query, filters, limits);
  }

  updateQuery(query) {
    this.setState({
      query: query
    });
  }

  /**
   * Method that controls the state of all filters. Using an immutable pattern
   * @id String (checking/unchecking 1 filter)
   *     Object (event, checking 1 category)
   */
  updateFilter(id) {
    let filters;
    if (typeof id === 'object' && id.target) {
      filters = this.state.filters.map(filter => {
        if (filter.type === id.target.value) {
          filter.checked = id.target.checked;
          return filter;
        }
        return filter;
      });
    } else {
      filters = this.state.filters.map(filter => {
        if (filter._id === id) {
          filter.checked = !filter.checked;
          return filter;
        }
        return filter;
      });
    }
    this.setState({
      filters: filters
    });
  }

  updateLimits(limits) {
    this.setState(limits)
  }

  render () {
    return (
      <div className="eight wide column">
        <h1 style={{'textAlign': 'center'}}>Lazy Traveller</h1>
          <SearchBar updateQuery={ this.updateQuery }
            submitHandler={ this.submitHandler } />
          <FilterList filters={ this.state.filters } 
            updateFilter={ this.updateFilter }
            updateLimits={ this.updateLimits }
            limitsStartLocation={ this.state.startLocation.place } />
      </div>
    );
  }
}
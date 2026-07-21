import pytest

@pytest.mark.django_db
def test_basic_math():
    assert 2 + 2 == 4
